package com.nextbank.notifications.repository;

import com.nextbank.notifications.entity.DeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {
    
    List<DeviceToken> findByUserIdAndIsActiveTrue(Long userId);
    
    Optional<DeviceToken> findByDeviceToken(String deviceToken);
    
    void deleteByDeviceToken(String deviceToken);
}
