package com.nextbank.accounts.repository;

import com.nextbank.accounts.entity.OtpRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpRecord, Long> {
    Optional<OtpRecord> findTopByIdentifierOrderByCreatedAtDesc(String identifier);
}
