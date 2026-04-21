package com.nextbank.accounts.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerifyRequest {
    @NotBlank(message = "Identifier (phone number) is required")
    private String identifier;

    @NotBlank(message = "OTP code is required")
    private String code;
}
