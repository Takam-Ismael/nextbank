package com.nextbank.notifications.service;

import com.nextbank.notifications.dto.NotificationRequest;
import com.nextbank.notifications.dto.NotificationResponse;
import com.nextbank.notifications.entity.DeviceToken;
import com.nextbank.notifications.entity.Notification;
import com.nextbank.notifications.repository.DeviceTokenRepository;
import com.nextbank.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final DeviceTokenRepository deviceTokenRepository;
    private final FcmService fcmService;

    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        // Save notification to database
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .title(request.getTitle())
                .message(request.getMessage())
                .referenceId(request.getReferenceId())
                .isRead(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        
        // Send push notification to all active devices for this user
        sendPushNotificationToUser(request.getUserId(), request.getTitle(), request.getMessage(), 
                                   request.getType().name(), request.getReferenceId());

        return mapToResponse(saved);
    }

    private void sendPushNotificationToUser(Long userId, String title, String message, String type, Long referenceId) {
        try {
            List<DeviceToken> activeTokens = deviceTokenRepository.findByUserIdAndIsActiveTrue(userId);
            
            if (activeTokens.isEmpty()) {
                log.debug("No active device tokens found for user {}", userId);
                return;
            }

            for (DeviceToken token : activeTokens) {
                fcmService.sendNotification(token.getDeviceToken(), title, message, type, referenceId);
            }
        } catch (Exception e) {
            log.error("Error sending push notification to user {}: {}", userId, e.getMessage());
            // Don't fail the notification creation if push fails
        }
    }

    @Transactional
    public void registerDeviceToken(Long userId, String deviceToken, DeviceToken.DeviceType deviceType) {
        // Check if token already exists
        deviceTokenRepository.findByDeviceToken(deviceToken).ifPresentOrElse(
            existing -> {
                // Update existing token
                existing.setUserId(userId);
                existing.setDeviceType(deviceType);
                existing.setIsActive(true);
                deviceTokenRepository.save(existing);
                log.info("Updated device token for user {}", userId);
            },
            () -> {
                // Create new token
                DeviceToken newToken = DeviceToken.builder()
                        .userId(userId)
                        .deviceToken(deviceToken)
                        .deviceType(deviceType)
                        .isActive(true)
                        .build();
                deviceTokenRepository.save(newToken);
                log.info("Registered new device token for user {}", userId);
            }
        );
    }

    @Transactional
    public void unregisterDeviceToken(String deviceToken) {
        deviceTokenRepository.findByDeviceToken(deviceToken).ifPresent(token -> {
            token.setIsActive(false);
            deviceTokenRepository.save(token);
            log.info("Unregistered device token for user {}", token.getUserId());
        });
    }

    public List<NotificationResponse> getMyNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<NotificationResponse> getMyNotificationsPaginated(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return notifications.map(this::mapToResponse);
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to notification");
        }
        
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        unreadNotifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    public Page<NotificationResponse> getAllNotifications(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findAll(pageable);
        return notifications.map(this::mapToResponse);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .referenceId(notification.getReferenceId())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
