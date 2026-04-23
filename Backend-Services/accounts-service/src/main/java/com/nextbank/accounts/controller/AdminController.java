package com.nextbank.accounts.controller;

import com.nextbank.accounts.dto.AccountDto;
import com.nextbank.accounts.dto.AdminRegisterRequest;
import com.nextbank.accounts.entity.User;
import com.nextbank.accounts.service.AccountService;
import com.nextbank.accounts.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final AccountService accountService;

    @PostMapping("/register-customer")
    public ResponseEntity<User> registerCustomer(@Valid @RequestBody AdminRegisterRequest request) {
        User customer = userService.registerCustomer(request);
        return ResponseEntity.ok(customer);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<User>> getCustomers() {
        return ResponseEntity.ok(userService.getAllCustomers());
    }

    @GetMapping("/pending-accounts")
    public ResponseEntity<List<AccountDto>> getPendingAccounts() {
        return ResponseEntity.ok(accountService.getPendingAccounts());
    }

    @PatchMapping("/approve-account/{accountId}")
    public ResponseEntity<AccountDto> approveAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(accountService.approveAccount(accountId));
    }

    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Object>> getStats() {
        return ResponseEntity.ok(accountService.getGlobalStats());
    }
}
