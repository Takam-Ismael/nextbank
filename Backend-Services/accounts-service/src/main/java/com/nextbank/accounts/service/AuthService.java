package com.nextbank.accounts.service;

import com.nextbank.accounts.dto.AuthResponse;
import com.nextbank.accounts.dto.LoginRequest;
import com.nextbank.accounts.entity.User;
import com.nextbank.accounts.repository.UserRepository;
import com.nextbank.accounts.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;
    private final QrCodeService qrCodeService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public byte[] getQrCodeByToken(String token) {
        User user = userRepository.findByQrTokenHash(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        return qrCodeService.generateQrCodeImage(token);
    }

    public String login(LoginRequest request) {
        // Step 1: Validate QR Code and Full Name (Case-insensitive name)
        String fullName = request.getFullName().trim();
        String qrCode = request.getQrCode().trim();

        Optional<User> userOpt = userRepository.findAll().stream()
                .filter(u -> u.getFullName().equalsIgnoreCase(fullName) && u.getQrTokenHash().equals(qrCode))
                .findFirst();
        
        if (userOpt.isEmpty()) {
            throw new org.springframework.security.authentication.BadCredentialsException("Invalid name or QR code. Please check your details and try again.");
        }
        
        User user = userOpt.get();
        // Step 2: Generate and send OTP via SMS
        otpService.generateAndSendOtp(user.getPhoneNumber());
        return user.getPhoneNumber();
    }

    public AuthResponse verifyOtp(String phoneNumber, String code) {
        // Step 1: Verify the OTP
        boolean isValid = otpService.verifyOtp(phoneNumber, code);
        
        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // Step 2: Retrieve the user
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 3: Generate JWT with userId
        String token = jwtUtil.generateToken(user.getPhoneNumber(), user.getRole().name(), user.getId());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }
    
    public AuthResponse adminLogin(com.nextbank.accounts.dto.AdminLoginRequest request) {
        User user = userRepository.findByPhoneNumber(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        
        if (user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized access");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        String token = jwtUtil.generateToken(user.getPhoneNumber(), user.getRole().name(), user.getId());
        
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }
}
