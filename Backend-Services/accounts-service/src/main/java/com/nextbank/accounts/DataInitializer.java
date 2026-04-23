package com.nextbank.accounts;

import com.nextbank.accounts.entity.User;
import com.nextbank.accounts.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // If there are no users in the DB, create an admin
        if (userRepository.count() == 0) {
            log.info("Database is empty. Creating Admin User...");

            // Create Admin
            User adminUser = User.builder()
                    .fullName("Super Admin")
                    .phoneNumber("admin")
                    .passwordHash(passwordEncoder.encode("admin123")) // Hash the password
                    .role(User.Role.ADMIN)
                    .qrTokenHash("admin_token")
                    .build();
            userRepository.save(adminUser);
            
            log.info("Admin Login: admin / admin123 (hashed)");
        }
    }
}
