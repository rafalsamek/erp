package com.smartvizz.erp.backend.services;

import com.smartvizz.erp.backend.data.entities.UserEntity;
import com.smartvizz.erp.backend.data.repositories.UserRepository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Optional;
import java.util.UUID;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Value("${app.baseUrl}")
    private String baseUrl;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    public UserEntity registerUser(String username, String email, String password) {
        // Validate username and email
        validateUserDetails(username, email);

        String encodedPassword = passwordEncoder.encode(password);
        String activationCode = UUID.randomUUID().toString();

        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encodedPassword);
        user.setEnabled(false);
        user.setActivationCode(activationCode);

        userRepository.save(user);
        sendActivationEmail(user);

        return user;
    }

    private void validateUserDetails(String username, String email) {
        Map<String, String> errors = new LinkedHashMap<>();

        // Check for uniqueness of username
        if (userRepository.existsByUsername(username)) {
            errors.put("username", "Username is already taken");
        }

        // Check for uniqueness of email
        if (userRepository.existsByEmail(email)) {
            errors.put("email", "Email is already registered");
        }

        // If there are errors, throw BadRequestException
        if (!errors.isEmpty()) {
            throw new BadRequestException(errors);
        }
    }

    private void sendActivationEmail(UserEntity user) {
        String subject = "Account Activation";
        String message = String.format(
                """
                        Hello %s,\s
                        
                         Please activate your account by clicking the link below:
                        %s/api/auth/activate?code=%s""",
                user.getUsername(), baseUrl, user.getActivationCode());

        try {
            MimeMessage mail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, false);
            helper.setFrom(mailUsername);
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(message, false);
            mailSender.send(mail);
        } catch (MessagingException e) {
            logger.error("Failed to send activation email to user: {}", user.getEmail(), e);
        }
    }

    public boolean activateUser(String code) {
        Optional<UserEntity> userOptional = userRepository.findByActivationCode(code);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            user.setEnabled(true);
            user.setActivationCode(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
