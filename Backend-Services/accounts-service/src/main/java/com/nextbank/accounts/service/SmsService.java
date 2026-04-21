package com.nextbank.accounts.service;

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
