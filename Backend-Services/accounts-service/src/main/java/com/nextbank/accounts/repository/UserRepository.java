package com.nextbank.accounts.repository;

import com.nextbank.accounts.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByQrTokenHash(String qrTokenHash);
    Optional<User> findByFullNameAndQrTokenHash(String fullName, String qrTokenHash);
    java.util.List<User> findAllByRole(User.Role role);
    long countByRole(User.Role role);
}
