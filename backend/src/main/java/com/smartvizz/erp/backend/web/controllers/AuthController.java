package com.smartvizz.erp.backend.web.controllers;

import com.smartvizz.erp.backend.data.entities.UserEntity;
import com.smartvizz.erp.backend.services.UserService;
import com.smartvizz.erp.backend.util.JwtUtil;
import com.smartvizz.erp.backend.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthRegisterResponse> registerUser(@RequestBody AuthRegisterRequest request) {
        UserEntity registeredUser = userService.registerUser(request.username(), request.email(), request.password());

        // Create a response DTO from the registered user
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
        boolean activated = userService.activateUser(code);
        String message = activated ? "Account activated successfully!" : "Invalid activation code!";
        return ResponseEntity.ok(new AuthActivateResponse(message));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponse> login(@RequestBody AuthLoginRequest request) {
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
    public ResponseEntity<String> logout() {
        // Invalidate session or clear security context
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout successful!");
    }
}
