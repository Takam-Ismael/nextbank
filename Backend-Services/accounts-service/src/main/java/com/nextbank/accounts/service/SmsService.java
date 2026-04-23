package com.nextbank.accounts.service;

import java.net.InetAddress;
import java.net.UnknownHostException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class SmsService {

    @Value("${http-sms.api-key}")
    private String apiKey;

    @Value("${http-sms.phone-number}")
    private String senderId;

    @Value("${app.demo-url:}")
    private String demoUrl;

    private final String baseUrl = "https://api.httpsms.com/v1";
    private final RestTemplate restTemplate;

    public SmsService() {
        this.restTemplate = new RestTemplate();
    }

    public boolean isApiKeyConfigured() {
        return apiKey != null && !apiKey.isEmpty() && !apiKey.equals("PLACEHOLDER");
    }

    public boolean sendOtpSms(String phoneNumber, String otp) {
        String message = String.format("NextBank: Your login code is %s. Valid for 5 minutes. Do not share it.", otp);
        return sendSms(phoneNumber, message);
    }

    public boolean sendRegistrationSms(String phoneNumber, String fullName) {
        String message = String.format("Welcome to NextBank, %s! Your application is being reviewed. You will receive an SMS once your account is active.", fullName);
        return sendSms(phoneNumber, message);
    }

    public boolean sendApprovalSms(String phoneNumber, String fullName, String qrToken, String baseUrl) {
        String effectiveBaseUrl = baseUrl;
        
        // Priority 1: Use Ngrok/Demo URL if you provided one
        if (demoUrl != null && !demoUrl.isEmpty()) {
            effectiveBaseUrl = demoUrl;
            log.info("Using Demo/Ngrok URL for SMS: {}", effectiveBaseUrl);
        }
        // Priority 2: If it's localhost, try to replace it with the computer's real network IP
        else if (baseUrl.contains("localhost") || baseUrl.contains("127.0.0.1")) {
            try {
                String localIp = InetAddress.getLocalHost().getHostAddress();
                effectiveBaseUrl = baseUrl.replace("localhost", localIp).replace("127.0.0.1", localIp);
                log.info("Detected local development IP for SMS: {}", localIp);
            } catch (UnknownHostException e) {
                log.warn("Could not detect local IP, falling back to provided baseUrl: {}", e.getMessage());
            }
        }

        String qrLink = effectiveBaseUrl + "/api/accounts/auth/qr/" + qrToken;
        String message = String.format(
            "Welcome to NextBank, %s! Your account is ACTIVE.\n\n" +
            "1. Download your Login QR: %s\n" +
            "2. Or use this SECURE LOGIN CODE: %s\n\n" +
            "Open the NextBank app to scan or enter your code manually.",
            fullName, qrLink, qrToken
        );
        return sendSms(phoneNumber, message);
    }

    public boolean sendSms(String phoneNumber, String message) {
        if (!isApiKeyConfigured()) {
            log.error("API key is not configured. Please set http-sms.api-key in application.yml");
            return false;
        }

        try {
            String url = baseUrl + "/messages/send";

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-api-key", apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Accept", "application/json");

            Map<String, Object> body = new HashMap<>();
            body.put("from", senderId);
            body.put("to", phoneNumber);
            body.put("content", message);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            log.info("Sending SMS to: {}", maskPhone(phoneNumber));

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("SMS sent successfully to: {}", maskPhone(phoneNumber));
                return true;
            } else {
                log.error("SMS failed with status: {}", response.getStatusCode());
                return false;
            }

        } catch (Exception e) {
            log.error("Exception sending SMS to {}: {}", maskPhone(phoneNumber), e.getMessage(), e);
            return false;
        }
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "****";
        return phone.substring(0, phone.length() - 4).replaceAll("\\d", "*") + phone.substring(phone.length() - 4);
    }
}
