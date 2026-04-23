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
        String token = qrCodeService.generateUserQrToken();
        User user = User.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(User.Role.CUSTOMER)
                .qrTokenHash(token)
                .build();
        
        User savedUser = userRepository.save(user);
        savedUser.setQrCodeBase64(qrCodeService.generateQrCodeBase64(token));

        // 2. Automatically create requested accounts
        java.util.List<Account.AccountType> types = request.getAccountTypes();
        if (types == null || types.isEmpty()) {
            types = java.util.List.of(Account.AccountType.SAVINGS); // default
        }

        for (Account.AccountType type : types) {
            BigDecimal initialBalance = type == Account.AccountType.CHECKING 
                ? new BigDecimal("50.00") 
                : BigDecimal.ZERO;

            Account account = Account.builder()
                    .user(savedUser)
                    .accountNumber(generateAccountNumber())
                    .balance(initialBalance)
                    .type(type)
                    .status(Account.AccountStatus.ACTIVE)
                    .build();
            
            accountRepository.save(account);
        }

        return savedUser;
    }

    public User getUserProfile(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public java.util.List<User> getAllCustomers() {
        return userRepository.findAllByRole(User.Role.CUSTOMER).stream()
            .peek(u -> u.setQrCodeBase64(qrCodeService.generateQrCodeBase64(u.getQrTokenHash())))
            .collect(java.util.stream.Collectors.toList());
    }

    private String generateAccountNumber() {
        // Simple random 10-digit account number
        return String.format("%010d", new Random().nextLong(10_000_000_000L));
    }
}
