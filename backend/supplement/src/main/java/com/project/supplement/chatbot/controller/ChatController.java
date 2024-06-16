package com.project.supplement.chatbot.controller;

import com.project.supplement.chatbot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    Mono<ResponseEntity<Map<String, Object>>> chat(@RequestBody Map<String, String> chatInfo) {
        return chatService.chat(chatInfo.get("chatId"), chatInfo.get("message"))
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.internalServerError().build());
    }
}
