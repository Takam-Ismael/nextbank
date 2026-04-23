package com.nextbank.cards.controller;

import com.nextbank.cards.dto.CardRequestDto;
import com.nextbank.cards.dto.CardResponseDto;
import com.nextbank.cards.security.UserAuthenticationToken;
import com.nextbank.cards.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping("/my")
    public ResponseEntity<List<CardResponseDto>> getMyCards(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(cardService.getMyCards(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardResponseDto> getCard(@PathVariable Long id, Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(cardService.getCardById(id, userId));
    }

    @PostMapping("/request")
    public ResponseEntity<CardResponseDto> requestCard(
            @RequestBody CardRequestDto request,
            @RequestHeader("Authorization") String authHeader,
            Authentication authentication) {
        
        Long userId = extractUserId(authentication);
        String token = authHeader.replace("Bearer ", "");
        return ResponseEntity.ok(cardService.requestCard(request, token, userId));
    }

    @PatchMapping("/{id}/freeze")
    public ResponseEntity<CardResponseDto> toggleFreeze(@PathVariable Long id, Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(cardService.toggleFreeze(id, userId));
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication instanceof UserAuthenticationToken) {
            return ((UserAuthenticationToken) authentication).getUserId();
        }
        throw new RuntimeException("Unable to extract user ID from authentication");
    }
}
