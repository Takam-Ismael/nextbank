package com.nextbank.notifications.dto;

import com.nextbank.notifications.entity.Notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest {
    private Long userId;
    private NotificationType type;
    private String title;
    private String message;
    private Long referenceId;
}
