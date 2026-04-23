package com.nextbank.accounts.controller;

import com.nextbank.accounts.entity.User;
import com.nextbank.accounts.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(Authentication authentication) {
        String phoneNumber = authentication.getName();
        return ResponseEntity.ok(userService.getUserProfile(phoneNumber));
    }
}
