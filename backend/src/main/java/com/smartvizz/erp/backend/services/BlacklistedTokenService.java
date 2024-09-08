package com.smartvizz.erp.backend.services;

import com.smartvizz.erp.backend.data.entities.BlacklistedToken;
import com.smartvizz.erp.backend.data.repositories.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class BlacklistedTokenService {

    private final BlacklistedTokenRepository blacklistedTokenRepository;

    public BlacklistedTokenService(BlacklistedTokenRepository blacklistedTokenRepository) {
        this.blacklistedTokenRepository = blacklistedTokenRepository;
    }

    public void blacklistToken(String token, Instant expiryDate) {
        BlacklistedToken blacklistedToken = new BlacklistedToken(token, expiryDate);
        blacklistedTokenRepository.save(blacklistedToken);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }
}
