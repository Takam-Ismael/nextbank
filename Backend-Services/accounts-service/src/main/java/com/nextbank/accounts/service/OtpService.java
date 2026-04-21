package com.nextbank.accounts.service;

import com.nextbank.accounts.entity.OtpRecord;
import com.nextbank.accounts.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final SmsService smsService;

    @Transactional
    public String generateAndSendOtp(String phoneNumber) {
        String otp = String.format("%06d", new Random().nextInt(1_000_000));
        
        OtpRecord record = OtpRecord.builder()
                .identifier(phoneNumber)
                .otpCode(otp)
                .used(false)
                .build();
                
        otpRepository.save(record);
        
        // Send the OTP via SMS
        boolean sent = smsService.sendOtpSms(phoneNumber, otp);
        if (!sent) {
            // In a real scenario we might throw an exception, but for now we log it.
            // Throwing might be better if we want to fail the login step 1.
        }
        
        return otp; // Return it just in case, but usually we just consider it sent
    }

    @Transactional
    public boolean verifyOtp(String phoneNumber, String code) {
        Optional<OtpRecord> optionalRecord = otpRepository.findTopByIdentifierOrderByCreatedAtDesc(phoneNumber);
        
        if (optionalRecord.isEmpty()) {
            return false;
        }
        
        OtpRecord record = optionalRecord.get();
        
        if (record.isUsed()) {
            return false;
        }
        
        if (LocalDateTime.now().isAfter(record.getExpiresAt())) {
            return false;
        }
        
        if (!record.getOtpCode().equals(code)) {
            return false;
        }
        
        // Mark as used
        record.setUsed(true);
        otpRepository.save(record);
        
        return true;
    }
}
