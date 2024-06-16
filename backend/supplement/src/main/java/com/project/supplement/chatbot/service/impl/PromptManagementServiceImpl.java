package com.project.supplement.chatbot.service.impl;

import com.project.supplement.chatbot.service.PromptManagementService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.MessageType;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class PromptManagementServiceImpl implements PromptManagementService {

    private static final Logger logger = LoggerFactory.getLogger(PromptManagementServiceImpl.class);
    @Value("classpath:/system-qa.st")
    private Resource systemPrompt;
    private final VectorStore vectorStore;
    private final Map<String, List<Message>> chatHistoryLog = new ConcurrentHashMap<>();
    private final Map<String, List<Message>> messageAggregations = new ConcurrentHashMap<>();

    @EventListener
    public void initializeChatEstablishedEvent(ChatEstablishedEvent event) {
        String chatId = event.getChatId();
        logger.debug("Chat established, adding to history log: {}", chatId);
        this.chatHistoryLog.put(chatId, new ArrayList<>());
    }

    @Override
    public boolean chatExists(String chatId) {
        return chatHistoryLog.containsKey(chatId);
    }

    public void commitToHistoryLog(String chatId, Message message) {
        this.chatHistoryLog.computeIfAbsent(chatId, key -> new ArrayList<>()).add(message);
    }

    public Message getSystemMessage(String chatId, String message) {
        // Retrieve related documents to query
        List<Document> similarDocuments = this.vectorStore.similaritySearch(message);

        if (!chatExists(chatId)) initializeChatEstablishedEvent((new ChatEstablishedEvent(this, chatId)));
        List<Message> conversationHistory = this.chatHistoryLog.get(chatId);

        String history = conversationHistory.stream()
                .map(m -> m.getMessageType().name().toLowerCase() + ": " + m.getContent())
                .collect(Collectors.joining(System.lineSeparator()));
        String documents = similarDocuments.stream().map(Document::getContent)
                .collect(Collectors.joining(System.lineSeparator()));

        Map<String, Object> prepareHistory = Map.of(
                "documents", documents,
                "current_date", java.time.LocalDate.now(),
                "history", history
        );
        return new SystemPromptTemplate(this.systemPrompt).createMessage(prepareHistory);
    }

    public void addMessage(String chatId, Message message) {
        String groupId = toGroupId(chatId, message);
        this.messageAggregations.computeIfAbsent(groupId, key -> new ArrayList<>()).add(message);
        String finishReason = getProperty(message, "finishReason");
        if ("STOP".equalsIgnoreCase(finishReason) || message.getMessageType() == MessageType.USER) {
            this.finalizeMessageGroup(chatId, groupId);
        }
    }

    public String toGroupId(String chatId, Message message) {
        String messageId = getProperty(message, "id");
        return chatId + ":" + messageId;
    }

    public String getProperty(Message message, String key) {
        return message.getMetadata().getOrDefault(key, "").toString();
    }

    public void finalizeMessageGroup(String chatId, String groupId) {
        List<Message> sessionMessages = this.messageAggregations.remove(groupId);

        if (!CollectionUtils.isEmpty(sessionMessages)) {
            if (sessionMessages.size() == 1) {
                this.commitToHistoryLog(chatId, sessionMessages.get(0));
            } else {
                String aggregatedContent = sessionMessages.stream()
                        .map(Message::getContent)
                        .filter(Objects::nonNull)
                        .collect(Collectors.joining());
                this.commitToHistoryLog(chatId, new AssistantMessage(aggregatedContent));
            }
        } else {
            logger.warn("No active session for groupId: {}", groupId);
        }
    }
}
