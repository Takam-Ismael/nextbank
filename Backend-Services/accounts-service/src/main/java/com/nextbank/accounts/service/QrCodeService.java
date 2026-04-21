package com.nextbank.accounts.service;

import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class QrCodeService {

    /**
     * Generates a unique, secure token for a user that will be encoded into a QR code.
     */
    public String generateUserQrToken() {
        // In a real banking app, this might be a signed hash or a more complex token.
        // For now, we use a secure UUID.
        return UUID.randomUUID().toString();
    }
}
