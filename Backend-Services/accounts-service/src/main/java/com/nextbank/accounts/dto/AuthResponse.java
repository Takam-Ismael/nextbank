package com.nextbank.accounts.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String role;
}
