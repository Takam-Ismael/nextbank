package com.nextbank.accounts.service;

import com.nextbank.accounts.client.NotificationsClient;
import com.nextbank.accounts.dto.AdminRegisterRequest;
import com.nextbank.accounts.entity.Account;
import com.nextbank.accounts.entity.User;
import com.nextbank.accounts.repository.AccountRepository;
import com.nextbank.accounts.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
    private final SmsService smsService;
    private final NotificationsClient notificationsClient;

    @Value("${app.base-url}")
    private String baseUrl;

    @Transactional
    public User registerCustomer(AdminRegisterRequest request) {
        // 1. Create User
        String token = qrCodeService.generateUserQrToken();
        User user = User.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .nationalId(request.getNationalId())
                .role(User.Role.CUSTOMER)
                .status("Pending")
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
            // Give 50 XAF bonus for both savings and checking
            BigDecimal initialBalance = (type == Account.AccountType.CHECKING || type == Account.AccountType.SAVINGS)
                ? new BigDecimal("50.00") 
                : BigDecimal.ZERO;

            Account account = Account.builder()
                    .user(savedUser)
                    .accountNumber(generateAccountNumber())
                    .balance(initialBalance)
                    .type(type)
                    .status(Account.AccountStatus.PENDING)
                    .build();
            
            accountRepository.save(account);
            savedUser.getAccounts().add(account);
        }

        // 3. Send Initial Welcome SMS (Account Pending)
        smsService.sendRegistrationSms(savedUser.getPhoneNumber(), savedUser.getFullName());

        // 4. Store WELCOME in-app notification
        notificationsClient.sendNotification(
            savedUser.getId(),
            "WELCOME",
            "Welcome to NextBank!",
            "Welcome, " + savedUser.getFullName() + "! Your account is being set up. You will receive your login credentials once approved.",
            null
        );

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

    public void deleteCustomer(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    @Transactional
    public User updateCustomer(Long userId, com.nextbank.accounts.dto.UpdateCustomerRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean wasActive = "Active".equals(user.getStatus());
        
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getNationalId() != null) user.setNationalId(request.getNationalId());
        if (request.getStatus() != null) user.setStatus(request.getStatus());
        
        User saved = userRepository.save(user);
        
        // If status changed to Active, send approval SMS
        if (!wasActive && "Active".equals(saved.getStatus())) {
            smsService.sendApprovalSms(saved.getPhoneNumber(), saved.getFullName(), saved.getQrTokenHash(), baseUrl);
            notificationsClient.sendNotification(
                saved.getId(),
                "WELCOME",
                "Account Approved",
                "Your NextBank account is now active, " + saved.getFullName() + "! Check your SMS for login credentials.",
                null
            );
        }

        saved.setQrCodeBase64(qrCodeService.generateQrCodeBase64(saved.getQrTokenHash()));
        return saved;
    }

    @Transactional
    public User approveUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean alreadyActive = "Active".equals(user.getStatus());
        user.setStatus("Active");
        User saved = userRepository.save(user);
        
        if (!alreadyActive) {
            smsService.sendApprovalSms(saved.getPhoneNumber(), saved.getFullName(), saved.getQrTokenHash(), baseUrl);
            // In-app notification: account is now active
            notificationsClient.sendNotification(
                saved.getId(),
                "WELCOME",
                "Account Approved",
                "Your NextBank account is now active, " + saved.getFullName() + "! Check your SMS for login credentials.",
                null
            );
        }

        saved.setQrCodeBase64(qrCodeService.generateQrCodeBase64(saved.getQrTokenHash()));
        return saved;
    }

    private String generateAccountNumber() {
        // Simple random 10-digit account number
        return String.format("%010d", new Random().nextLong(10_000_000_000L));
    }
}
