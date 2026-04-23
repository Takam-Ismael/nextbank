package com.nextbank.notifications.controller;

import com.nextbank.notifications.dto.NotificationRequest;
import com.nextbank.notifications.dto.NotificationResponse;
import com.nextbank.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/notifications")
@RequiredArgsConstructor
public class InternalNotificationController {

    private final NotificationService notificationService;

    // POST /internal/notifications - Called by Accounts, Transactions, Cards services
    // NOT exposed through Kong - internal service-to-service only
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(@RequestBody NotificationRequest request) {
        NotificationResponse response = notificationService.createNotification(request);
        return ResponseEntity.ok(response);
    }
}
