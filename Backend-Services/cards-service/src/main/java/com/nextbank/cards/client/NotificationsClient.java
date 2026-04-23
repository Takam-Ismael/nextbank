package com.nextbank.cards.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class NotificationsClient {

    private final RestTemplate restTemplate;

    @Value("${notifications-service.url:http://localhost:8084}")
    private String notificationsServiceUrl;

    public NotificationsClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendNotification(Long userId, String type, String title, String message, Long referenceId) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("userId", userId);
            request.put("type", type);
            request.put("title", title);
            request.put("message", message);
            request.put("referenceId", referenceId);

            restTemplate.postForEntity(notificationsServiceUrl + "/internal/notifications", request, Void.class);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
}
