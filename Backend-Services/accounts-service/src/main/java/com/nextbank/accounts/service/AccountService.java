package com.nextbank.accounts.service;

import com.nextbank.accounts.client.NotificationsClient;
import com.nextbank.accounts.dto.AccountDto;
import com.nextbank.accounts.entity.Account;
import com.nextbank.accounts.entity.User;
import com.nextbank.accounts.repository.AccountRepository;
import com.nextbank.accounts.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final NotificationsClient notificationsClient;

    public List<AccountDto> getAccountsByUserPhoneNumber(String phoneNumber) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return accountRepository.findByUser(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AccountDto getAccountDetails(String accountNumber, String phoneNumber) {
        Account account = getAccountAndVerifyOwnership(accountNumber, phoneNumber);
        return mapToDto(account);
    }

    public AccountDto getAccountById(Long accountId, String phoneNumber) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to account");
        }
        return mapToDto(account);
    }

    @Transactional
    public AccountDto creditAccount(String accountNumber, BigDecimal amount, String phoneNumber) {
        Account account = getAccountAndVerifyOwnership(accountNumber, phoneNumber);
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        account.setBalance(account.getBalance().add(amount));
        return mapToDto(accountRepository.save(account));
    }

    @Transactional
    public AccountDto debitAccount(String accountNumber, BigDecimal amount, String phoneNumber) {
        Account account = getAccountAndVerifyOwnership(accountNumber, phoneNumber);
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (account.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }
        account.setBalance(account.getBalance().subtract(amount));
        return mapToDto(accountRepository.save(account));
    }

    private Account getAccountAndVerifyOwnership(String accountNumber, String phoneNumber) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to account");
        }
        return account;
    }

    @Transactional
    public AccountDto openAccount(Account.AccountType type, String phoneNumber) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Account account = Account.builder()
                .user(user)
                .accountNumber(generateAccountNumber())
                .balance(BigDecimal.ZERO)
                .type(type)
                .status(Account.AccountStatus.PENDING)
                .build();
        Account saved = accountRepository.save(account);

        // Notify the customer their request was received
        notificationsClient.sendNotification(
            user.getId(),
            "DEPOSIT_PENDING",
            "Account Request Submitted",
            "Your request to open a " + type.name() + " account has been submitted and is pending approval.",
            saved.getId()
        );

        // Notify admin (userId=1 is the seeded admin)
        notificationsClient.sendNotification(
            1L,
            "DEPOSIT_PENDING",
            "New Account Request",
            "Customer " + user.getFullName() + " has requested a new " + type.name() + " account. Please review in Compliance.",
            saved.getId()
        );

        return mapToDto(saved);
    }

    @Transactional
    public AccountDto approveAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setStatus(Account.AccountStatus.ACTIVE);
        Account saved = accountRepository.save(account);
        notificationsClient.sendNotification(
            saved.getUser().getId(),
            "ACCOUNT_APPROVED",
            "Account Approved",
            "Your new account " + saved.getAccountNumber() + " has been approved and is now active.",
            saved.getId()
        );
        return mapToDto(saved);
    }

    @Transactional
    public AccountDto toggleFreezeAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        boolean wasFrozen = account.getStatus() == Account.AccountStatus.FROZEN;
        account.setStatus(wasFrozen ? Account.AccountStatus.ACTIVE : Account.AccountStatus.FROZEN);
        Account saved = accountRepository.save(account);

        // Send in-app notification
        String type    = wasFrozen ? "ACCOUNT_UNFROZEN" : "ACCOUNT_FROZEN";
        String title   = wasFrozen ? "Account Reactivated" : "Account Frozen";
        String message = wasFrozen
            ? "Your account " + saved.getAccountNumber() + " has been reactivated."
            : "Your account " + saved.getAccountNumber() + " has been frozen by the bank. Contact support if this is unexpected.";

        notificationsClient.sendNotification(saved.getUser().getId(), type, title, message, saved.getId());

        return mapToDto(saved);
    }

    @Transactional
    public void approveAllUserAccounts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Account> accounts = accountRepository.findByUser(user);
        for (Account acc : accounts) {
            if (acc.getStatus() == Account.AccountStatus.PENDING) {
                acc.setStatus(Account.AccountStatus.ACTIVE);
                Account saved = accountRepository.save(acc);
                notificationsClient.sendNotification(
                    saved.getUser().getId(),
                    "ACCOUNT_APPROVED",
                    "Account Approved",
                    "Your new account " + saved.getAccountNumber() + " has been approved and is now active.",
                    saved.getId()
                );
            }
        }
    }

    public List<AccountDto> getPendingAccounts() {
        return accountRepository.findAll().stream()
                .filter(acc -> acc.getStatus() == Account.AccountStatus.PENDING)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private String generateAccountNumber() {
        return String.format("%010d", new java.util.Random().nextLong(10_000_000_000L));
    }

    public java.util.Map<String, Object> getGlobalStats() {
        BigDecimal totalRevenue = accountRepository.findAll().stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long activeUsers = userRepository.countByRole(User.Role.CUSTOMER);
        long pendingAccounts = accountRepository.findAll().stream()
                .filter(acc -> acc.getStatus() == Account.AccountStatus.PENDING)
                .count();

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("activeUsers", activeUsers);
        stats.put("pendingAccounts", pendingAccounts);
        stats.put("transactions", 0); // Placeholder if no transaction table
        return stats;
    }

    private AccountDto mapToDto(Account account) {
        return AccountDto.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .type(account.getType().name())
                .status(account.getStatus().name())
                .userName(account.getUser() != null ? account.getUser().getFullName() : null)
                .userId(account.getUser() != null ? account.getUser().getId() : null)
                .build();
    }
}
