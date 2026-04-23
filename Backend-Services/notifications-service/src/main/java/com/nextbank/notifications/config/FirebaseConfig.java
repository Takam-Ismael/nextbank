package com.nextbank.notifications.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.enabled:true}")
    private boolean firebaseEnabled;

    @Value("${firebase.service-account-key-path:}")
    private Resource serviceAccountKeyPath;

    @Value("${firebase.service-account-key-base64:}")
    private String serviceAccountKeyBase64;

    @PostConstruct
    public void initialize() {
        if (!firebaseEnabled) {
            log.warn("Firebase is disabled. Push notifications will not be sent.");
            return;
        }

        try {
            InputStream serviceAccount = getServiceAccountInputStream();
            
            if (serviceAccount == null) {
                log.warn("Firebase service account not configured. Push notifications will not be sent.");
                log.warn("Please provide either:");
                log.warn("  1. firebase.service-account-key-path (path to JSON file)");
                log.warn("  2. firebase.service-account-key-base64 (base64 encoded JSON)");
                return;
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                log.info("Firebase initialized successfully for push notifications");
            }
        } catch (IOException e) {
            log.error("Failed to initialize Firebase: {}", e.getMessage());
            log.warn("Push notifications will not be sent");
        }
    }

    private InputStream getServiceAccountInputStream() throws IOException {
        // Priority 1: Base64 encoded service account (for environment variables)
        if (serviceAccountKeyBase64 != null && !serviceAccountKeyBase64.isEmpty()) {
            byte[] decodedKey = Base64.getDecoder().decode(serviceAccountKeyBase64);
            return new ByteArrayInputStream(decodedKey);
        }

        // Priority 2: File path
        if (serviceAccountKeyPath != null && serviceAccountKeyPath.exists()) {
            return serviceAccountKeyPath.getInputStream();
        }

        return null;
    }
}
