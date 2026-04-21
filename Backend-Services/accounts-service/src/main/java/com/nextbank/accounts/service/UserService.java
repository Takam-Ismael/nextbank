package com.nextbank.accounts.service;

import com.nextbank.accounts.dto.AdminRegisterRequest;
import com.nextbank.accounts.entity.Account;
import com.nextbank.accounts.entity.User;
import com.nextbank.accounts.repository.AccountRepository;
import com.nextbank.accounts.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final QrCodeService qrCodeService;

    @Transactional
    public User registerCustomer(AdminRegisterRequest request) {
        // 1. Create User
        User user = User.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(User.Role.CUSTOMER)
                .qrTokenHash(qrCodeService.generateUserQrToken()) // The "hash" we store/validate
                .build();
        
        User savedUser = userRepository.save(user);

        // 2. Automatically create a default savings account
        Account account = Account.builder()
                .user(savedUser)
                .accountNumber(generateAccountNumber())
                .balance(BigDecimal.ZERO)
                .type(Account.AccountType.SAVINGS)
                .build();
        
        accountRepository.save(account);

        return savedUser;
    }

    private String generateAccountNumber() {
        // Simple random 10-digit account number
        return String.format("%010d", new Random().nextLong(10_000_000_000L));
    }
}
