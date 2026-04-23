package com.nextbank.cards.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class AccountsClient {

    private final RestTemplate restTemplate;
    
    @Value("${accounts-service.url:http://localhost:8085}")
    private String accountsServiceUrl;

    public AccountsClient() {
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> getAccountDetails(Long accountId, String token) {
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    accountsServiceUrl + "/api/accounts/" + accountId,
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            return null;
        }
    }

    public Map<String, Object> getMe(String token) {
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    accountsServiceUrl + "/api/accounts/me",
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            return null;
        }
    }
}
