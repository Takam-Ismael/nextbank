package com.nextbank.accounts.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminLoginRequest {

    @NotBlank(message = "Username/Phone is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
