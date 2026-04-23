package com.nextbank.cards.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CardResponseDto {
    private Long id;
    private Long accountId;
    private String accountNumber;
    private String cardLastFour;
    private String cardType;
    private Short expiryMonth;
    private Short expiryYear;
    private String cardholderName;
    private String status;
    private LocalDateTime createdAt;
}
