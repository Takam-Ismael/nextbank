package com.nextbank.accounts.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminRegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String email;
    private String nationalId;

    private java.util.List<com.nextbank.accounts.entity.Account.AccountType> accountTypes;
}
