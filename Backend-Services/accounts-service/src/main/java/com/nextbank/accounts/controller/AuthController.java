package com.nextbank.accounts.controller;

import com.nextbank.accounts.dto.AuthResponse;
import com.nextbank.accounts.dto.LoginRequest;
import com.nextbank.accounts.dto.OtpVerifyRequest;
import com.nextbank.accounts.service.AuthService;
import com.nextbank.accounts.service.QrCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/accounts/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final QrCodeService qrCodeService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest loginRequest) {
        String phoneNumber = authService.login(loginRequest);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "OTP sent successfully.",
                "phoneNumber", phoneNumber));
    }

    @PostMapping("/upload-qr")
    public ResponseEntity<?> uploadQr(@RequestParam("file") MultipartFile file) {
        try {
            String decodedToken = qrCodeService.decodeQrCode(file.getBytes());
            return ResponseEntity.ok(Map.of("token", decodedToken));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyOtp(request.getIdentifier(), request.getCode());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@Valid @RequestBody com.nextbank.accounts.dto.AdminLoginRequest request) {
        try {
            AuthResponse response = authService.adminLogin(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/qr/{token}")
    public ResponseEntity<byte[]> getQrCode(@PathVariable String token) {
        byte[] image = authService.getQrCodeByToken(token);
        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.IMAGE_PNG)
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"NextBank_Login_QR.png\"")
                .body(image);
    }
}
