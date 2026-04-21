package com.nextbank.accounts.controller;

import com.nextbank.accounts.dto.AdminRegisterRequest;
import com.nextbank.accounts.entity.User;
import com.nextbank.accounts.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PostMapping("/register-customer")
    public ResponseEntity<User> registerCustomer(@Valid @RequestBody AdminRegisterRequest request) {
        User customer = userService.registerCustomer(request);
        return ResponseEntity.ok(customer);
    }
}
