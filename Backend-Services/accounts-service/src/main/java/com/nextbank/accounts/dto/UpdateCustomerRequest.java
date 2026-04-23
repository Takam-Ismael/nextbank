package com.nextbank.accounts.dto;

import lombok.Data;

@Data
public class UpdateCustomerRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String nationalId;
    private String status;
}
