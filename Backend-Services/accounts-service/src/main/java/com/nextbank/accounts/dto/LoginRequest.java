package com.nextbank.accounts.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "QR Code is required")
    private String qrCode;
}
