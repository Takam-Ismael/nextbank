package com.nextbank.notifications.controller;

import com.nextbank.notifications.dto.NotificationResponse;
import com.nextbank.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications/admin")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final NotificationService notificationService;

    // GET /api/notifications/admin/all - Admin views all notifications paginated
    @GetMapping("/all")
    public ResponseEntity<Page<NotificationResponse>> getAllNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<NotificationResponse> notifications = notificationService.getAllNotifications(page, size);
        return ResponseEntity.ok(notifications);
    }

    // PATCH /api/notifications/admin/{id}/read - Admin marks a notification as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<java.util.Map<String, String>> markAsRead(@PathVariable Long id) {
        notificationService.adminMarkAsRead(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Notification marked as read"));
    }
}
