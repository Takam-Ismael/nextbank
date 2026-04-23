package com.nextbank.notifications.controller;

import com.nextbank.notifications.dto.DeviceTokenRequest;
import com.nextbank.notifications.dto.NotificationResponse;
import com.nextbank.notifications.repository.NotificationRepository;
import com.nextbank.notifications.security.UserAuthenticationToken;
import com.nextbank.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    // POST /api/notifications/device-token - Register FCM device token
    @PostMapping("/device-token")
    public ResponseEntity<Map<String, String>> registerDeviceToken(
            @RequestBody DeviceTokenRequest request,
            Authentication authentication) {
        Long userId = extractUserId(authentication);
        notificationService.registerDeviceToken(userId, request.getDeviceToken(), request.getDeviceType());
        return ResponseEntity.ok(Map.of("message", "Device token registered successfully"));
    }

    // DELETE /api/notifications/device-token - Unregister FCM device token
    @DeleteMapping("/device-token")
    public ResponseEntity<Map<String, String>> unregisterDeviceToken(
            @RequestBody Map<String, String> request) {
        String deviceToken = request.get("deviceToken");
        notificationService.unregisterDeviceToken(deviceToken);
        return ResponseEntity.ok(Map.of("message", "Device token unregistered successfully"));
    }

    // GET /api/notifications/my - Customer lists own notifications sorted newest first
    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication authentication) {
        Long userId = extractUserId(authentication);
        List<NotificationResponse> notifications = notificationService.getMyNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    // GET /api/notifications/my/unread-count - Returns integer count for mobile badge
    @GetMapping("/my/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        Long userId = extractUserId(authentication);
        Long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    // PATCH /api/notifications/{id}/read - Mark single notification as read (own only)
    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long id, Authentication authentication) {
        Long userId = extractUserId(authentication);
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    // PATCH /api/notifications/read-all - Mark all own notifications as read
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication authentication) {
        Long userId = extractUserId(authentication);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication instanceof UserAuthenticationToken) {
            return ((UserAuthenticationToken) authentication).getUserId();
        }
        throw new RuntimeException("Unable to extract user ID from authentication");
    }
}
