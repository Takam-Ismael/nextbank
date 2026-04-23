package com.nextbank.accounts.dto;

import com.nextbank.accounts.entity.Account;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OpenAccountRequest {
    @NotNull(message = "Account type is required")
    private Account.AccountType type;
}
