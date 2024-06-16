package com.project.supplement.chatbot.service;

import org.springframework.ai.chat.messages.Message;
public interface PromptManagementService {

    void commitToHistoryLog(String chatId, Message message);

    Message getSystemMessage(String chatId, String message);

    void addMessage(String chatId, Message message);

    String toGroupId(String chatId, Message message);

    String getProperty(Message message, String key);

    void finalizeMessageGroup(String chatId, String groupId);

    boolean chatExists(String chatId);
}
