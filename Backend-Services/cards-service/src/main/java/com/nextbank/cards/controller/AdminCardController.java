package com.nextbank.cards.controller;

import com.nextbank.cards.dto.CardResponseDto;
import com.nextbank.cards.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cards/admin")
@RequiredArgsConstructor
public class AdminCardController {

    private final CardService cardService;

    @GetMapping("/all")
    public ResponseEntity<Page<CardResponseDto>> getAllCards(Pageable pageable) {
        return ResponseEntity.ok(cardService.getAllCards(pageable));
    }
}
