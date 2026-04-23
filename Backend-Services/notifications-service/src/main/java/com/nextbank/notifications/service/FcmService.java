package com.nextbank.notifications.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class FcmService {

    @Value("${firebase.enabled:true}")
    private boolean firebaseEnabled;

    /**
     * Send push notification to a specific device token
     */
    public void sendPushNotification(String deviceToken, String title, String body, Map<String, String> data) {
        if (!firebaseEnabled || FirebaseApp.getApps().isEmpty()) {
            log.debug("Firebase not configured. Skipping push notification: {} - {}", title, body);
            return;
        }

        if (deviceToken == null || deviceToken.isEmpty()) {
            log.debug("No device token provided. Skipping push notification.");
            return;
        }

        try {
            // Build notification
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            // Build message with data payload
            Message.Builder messageBuilder = Message.builder()
                    .setToken(deviceToken)
                    .setNotification(notification);

            // Add data payload if provided
            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            // Add Android-specific configuration
            AndroidConfig androidConfig = AndroidConfig.builder()
                    .setPriority(AndroidConfig.Priority.HIGH)
                    .setNotification(AndroidNotification.builder()
                            .setSound("default")
                            .setColor("#1E88E5") // NextBank blue
                            .build())
                    .build();
            messageBuilder.setAndroidConfig(androidConfig);

            // Add iOS-specific configuration
            ApnsConfig apnsConfig = ApnsConfig.builder()
                    .setAps(Aps.builder()
                            .setSound("default")
                            .setBadge(1)
                            .build())
                    .build();
            messageBuilder.setApnsConfig(apnsConfig);

            Message message = messageBuilder.build();

            // Send message
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Successfully sent push notification: {}", response);

        } catch (FirebaseMessagingException e) {
            log.error("Failed to send push notification to token {}: {}", deviceToken, e.getMessage());
            
            // Handle specific error codes
            if (e.getMessagingErrorCode() == MessagingErrorCode.INVALID_ARGUMENT) {
                log.error("Invalid device token: {}", deviceToken);
            } else if (e.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED) {
                log.error("Device token is no longer valid (unregistered): {}", deviceToken);
                // TODO: Mark device token as invalid in database
            }
        } catch (Exception e) {
            log.error("Unexpected error sending push notification: {}", e.getMessage());
        }
    }

    /**
     * Send push notification with notification type
     */
    public void sendNotification(String deviceToken, String title, String body, String notificationType, Long referenceId) {
        Map<String, String> data = new HashMap<>();
        data.put("type", notificationType);
        if (referenceId != null) {
            data.put("referenceId", referenceId.toString());
        }
        data.put("click_action", "FLUTTER_NOTIFICATION_CLICK");
        
        sendPushNotification(deviceToken, title, body, data);
    }
}
