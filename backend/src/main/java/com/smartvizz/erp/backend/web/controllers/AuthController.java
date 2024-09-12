package com.smartvizz.erp.backend.web.controllers;

import com.smartvizz.erp.backend.data.entities.UserEntity;
import com.smartvizz.erp.backend.services.BlacklistedTokenService;
import com.smartvizz.erp.backend.services.UserService;
import com.smartvizz.erp.backend.util.JwtUtil;
import com.smartvizz.erp.backend.web.models.*;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import com.smartvizz.erp.backend.services.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:8888", "http://localhost:4200"})
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final BlacklistedTokenService blacklistedTokenService;

    @Autowired
    public AuthController(
            UserService userService,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager,
            BlacklistedTokenService blacklistedTokenService
    ) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.blacklistedTokenService = blacklistedTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthRegisterResponse> registerUser(
            @Valid @RequestBody AuthRegisterRequest request
    ) throws BadRequestException {
        UserEntity registeredUser = userService.registerUser(request.username(), request.email(), request.password());


        AuthRegisterResponse response = new AuthRegisterResponse(
                registeredUser.getId(),
                registeredUser.getUsername(),
                registeredUser.getEmail(),
                registeredUser.isEnabled()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/activate")
    public ResponseEntity<AuthActivateResponse> activateUser(@RequestParam String code) {
        // Fetch user by activation code
        UserEntity user = userService.findByActivationCode(code);
        if (user != null) {
            // Activate user if found and not yet activated
            boolean activated = userService.activateUser(code);
            if (activated) {
                // Generate JWT token for the user after activation
                String jwtToken = jwtUtil.generateToken(user.getUsername());
                return ResponseEntity.ok(
                        new AuthActivateResponse(
                                "Account activated successfully!",
                                user.getUsername(),
                                jwtToken
                        )
                );
            }
        }

        return ResponseEntity.ok(new AuthActivateResponse("Invalid activation code!", null, null));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponse> login(@Valid @RequestBody AuthLoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String jwt = jwtUtil.generateToken(request.username());

            return ResponseEntity.ok(new AuthLoginResponse(jwt));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new AuthLoginResponse("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, @RequestHeader("Authorization") String authHeader) {
        String token = extractJwtFromRequest(authHeader);

        if (token != null) {
            // Get token expiration date
            Claims claims = jwtUtil.extractAllClaims(token);
            Date expiryDate = claims.getExpiration();

            // Blacklist the token
            blacklistedTokenService.blacklistToken(token, expiryDate.toInstant());

            // Clear the security context
            SecurityContextHolder.clearContext();

            return ResponseEntity.ok("Logout successful! Token invalidated.");
        }

        return ResponseEntity.badRequest().body("Invalid token.");
    }

    // Helper function to extract JWT from Authorization header
    private String extractJwtFromRequest(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        
        return null;
    }
}
