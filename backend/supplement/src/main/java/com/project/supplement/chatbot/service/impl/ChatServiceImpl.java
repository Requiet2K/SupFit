package com.project.supplement.chatbot.service.impl;

import com.project.supplement.chatbot.service.ChatService;
import com.project.supplement.chatbot.service.PromptManagementService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.metadata.ChatGenerationMetadata;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatServiceImpl.class);
    private final OllamaChatModel chatClient;
    private final PromptManagementService promptManagementService;
    private final ApplicationEventPublisher eventPublisher;


    public String establishChat() {
        String chatId = UUID.randomUUID().toString();
        logger.debug("Establishing chat with chatId: {}", chatId);

        eventPublisher.publishEvent(new ChatEstablishedEvent(this, chatId));
        return chatId;
    }


    public Mono<Map<String, Object>> chat(String chatId, String message) {
        Message systemMessage = promptManagementService.getSystemMessage(chatId, message);
        UserMessage userMessage = new UserMessage(message);
        promptManagementService.addMessage(chatId, userMessage);
        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));

        logger.info("Sending prompt to Ollama: {}", prompt);

        return chatClient.stream(prompt)
                .map(chatResponse -> {
                    return (chatResponse.getResult() != null &&
                            chatResponse.getResult().getOutput() != null)
                            ? chatResponse.getResult().getOutput().getContent()
                            : "";
                })
                .collectList()
                .map(contentList -> {
                    String fullContent = String.join("", contentList);
                    Generation finalGeneration = new Generation(fullContent);

                    ChatGenerationMetadata generationMetadata = finalGeneration.getMetadata();

                    Map<String, Object> outputMap = new HashMap<>();
                    outputMap.put("output", finalGeneration.getOutput().getContent());

                    return outputMap;
                });
    }
}
