package com.nextbank.notifications.dto;

import com.nextbank.notifications.entity.Notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private Long userId;
    private NotificationType type;
    private String title;
    private String message;
    private Boolean isRead;
    private Long referenceId;
    private LocalDateTime createdAt;
}
