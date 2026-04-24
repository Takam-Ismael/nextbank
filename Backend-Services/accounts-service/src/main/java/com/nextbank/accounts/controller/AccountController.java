package com.nextbank.accounts.controller;

import com.nextbank.accounts.dto.AccountDto;
import com.nextbank.accounts.dto.CreditDebitRequest;
import com.nextbank.accounts.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<List<AccountDto>> getMyAccounts(Authentication authentication) {
        String phoneNumber = authentication.getName();
        return ResponseEntity.ok(accountService.getAccountsByUserPhoneNumber(phoneNumber));
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountDto> getAccountDetails(@PathVariable String accountNumber, Authentication authentication) {
        String phoneNumber = authentication.getName();
        return ResponseEntity.ok(accountService.getAccountDetails(accountNumber, phoneNumber));
    }

    @GetMapping("/id/{accountId}")
    public ResponseEntity<AccountDto> getAccountById(@PathVariable Long accountId, Authentication authentication) {
        String phoneNumber = authentication.getName();
        return ResponseEntity.ok(accountService.getAccountById(accountId, phoneNumber));
    }

    @PostMapping("/{accountNumber}/credit")
    public ResponseEntity<AccountDto> creditAccount(@PathVariable String accountNumber,
                                                    @RequestBody CreditDebitRequest request,
                                                    Authentication authentication) {
        String phoneNumber = authentication.getName();
        return ResponseEntity.ok(accountService.creditAccount(accountNumber, request.getAmount(), phoneNumber));
    }

    @PostMapping("/{accountNumber}/debit")
    public ResponseEntity<AccountDto> debitAccount(@PathVariable String accountNumber,
                                                   @RequestBody CreditDebitRequest request,
                                                   Authentication authentication) {
        String phoneNumber = authentication.getName();
        return ResponseEntity.ok(accountService.debitAccount(accountNumber, request.getAmount(), phoneNumber));
    }

    @PostMapping("/open")
    public ResponseEntity<AccountDto> openAccount(@jakarta.validation.Valid @RequestBody com.nextbank.accounts.dto.OpenAccountRequest request,
                                                  Authentication authentication) {
        String phoneNumber = authentication.getName();
        return ResponseEntity.ok(accountService.openAccount(request.getType(), phoneNumber));
    }
}
