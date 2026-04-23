package com.nextbank.accounts.service;

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
        return mapToDto(accountRepository.save(account));
    }

    @Transactional
    public AccountDto approveAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setStatus(Account.AccountStatus.ACTIVE);
        return mapToDto(accountRepository.save(account));
    }

    @Transactional
    public void approveAllUserAccounts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Account> accounts = accountRepository.findByUser(user);
        for (Account acc : accounts) {
            if (acc.getStatus() == Account.AccountStatus.PENDING) {
                acc.setStatus(Account.AccountStatus.ACTIVE);
                accountRepository.save(acc);
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
                .build();
    }
}
