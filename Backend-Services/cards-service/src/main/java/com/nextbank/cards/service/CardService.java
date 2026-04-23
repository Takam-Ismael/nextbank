package com.nextbank.cards.service;

import com.nextbank.cards.client.AccountsClient;
import com.nextbank.cards.client.NotificationsClient;
import com.nextbank.cards.dto.CardRequestDto;
import com.nextbank.cards.dto.CardResponseDto;
import com.nextbank.cards.entity.Card;
import com.nextbank.cards.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final AccountsClient accountsClient;
    private final NotificationsClient notificationsClient;
    private final PasswordEncoder passwordEncoder;

    public CardResponseDto requestCard(CardRequestDto request, String token, Long userId) {
        // 1. Verify account belongs to customer
        Map<String, Object> accountDetails = accountsClient.getAccountDetails(request.getAccountId(), token);
        if (accountDetails == null) {
            throw new RuntimeException("Account not found or access denied.");
        }

        Number accountUserId = (Number) accountDetails.get("userId");
        if (accountUserId == null || accountUserId.longValue() != userId) {
            throw new RuntimeException("Account does not belong to the user.");
        }

        String accountStatus = (String) accountDetails.get("status");
        if (!"ACTIVE".equals(accountStatus)) {
            throw new RuntimeException("Account is not active.");
        }

        String accountNumber = (String) accountDetails.get("accountNumber");
        // We might not have cardholderName from account, usually it's from User details.
        // For simplicity, passing a placeholder or extracting if available.
        String cardholderName = "Customer " + userId;

        // 3. Generate 16-digit Luhn-valid card number (Prefix 4 = Visa)
        String cardNumber = LuhnValidator.generate("4");

        // 4. Generate 3-digit CVV
        String cvv = String.format("%03d", new Random().nextInt(1000));

        // 5. BCrypt hash the CVV
        String cvvHash = passwordEncoder.encode(cvv);

        // 6. Set expiry: NOW() + 3 years
        LocalDateTime expiry = LocalDateTime.now().plusYears(3);

        // 7. INSERT card record
        Card card = Card.builder()
                .userId(userId)
                .accountId(request.getAccountId())
                .accountNumber(accountNumber)
                .cardNumber(cardNumber)
                .cardLastFour(cardNumber.substring(12))
                .cardType("VISA")
                .cvvHash(cvvHash)
                .expiryMonth((short) expiry.getMonthValue())
                .expiryYear((short) expiry.getYear())
                .cardholderName(cardholderName)
                .status("ACTIVE")
                .build();

        Card savedCard = cardRepository.save(card);

        // 8. REST -> Notifications: CARD_CREATED
        notificationsClient.sendNotification(
                userId,
                "CARD_CREATED",
                "New Card Issued",
                "Your new Visa card ending in " + savedCard.getCardLastFour() + " is ready.",
                savedCard.getId()
        );

        return mapToDto(savedCard);
    }

    public List<CardResponseDto> getMyCards(Long userId) {
        return cardRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CardResponseDto getCardById(Long cardId, Long userId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        if (!card.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        return mapToDto(card);
    }

    public CardResponseDto toggleFreeze(Long cardId, Long userId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        if (!card.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        if ("ACTIVE".equals(card.getStatus())) {
            card.setStatus("FROZEN");
            notificationsClient.sendNotification(userId, "CARD_FROZEN", "Card Frozen", "Your card ending in " + card.getCardLastFour() + " has been frozen.", card.getId());
        } else if ("FROZEN".equals(card.getStatus())) {
            card.setStatus("ACTIVE");
            notificationsClient.sendNotification(userId, "CARD_UNFROZEN", "Card Unfrozen", "Your card ending in " + card.getCardLastFour() + " has been unfrozen.", card.getId());
        }

        return mapToDto(cardRepository.save(card));
    }

    public org.springframework.data.domain.Page<CardResponseDto> getAllCards(org.springframework.data.domain.Pageable pageable) {
        return cardRepository.findAll(pageable).map(this::mapToDto);
    }

    private CardResponseDto mapToDto(Card card) {
        return CardResponseDto.builder()
                .id(card.getId())
                .accountId(card.getAccountId())
                .accountNumber(card.getAccountNumber())
                .cardLastFour(card.getCardLastFour())
                .cardType(card.getCardType())
                .expiryMonth(card.getExpiryMonth())
                .expiryYear(card.getExpiryYear())
                .cardholderName(card.getCardholderName())
                .status(card.getStatus())
                .createdAt(card.getCreatedAt())
                .build();
    }
}
