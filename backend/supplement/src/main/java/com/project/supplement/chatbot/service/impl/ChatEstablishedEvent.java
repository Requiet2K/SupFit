package com.project.supplement.chatbot.service.impl;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
@Getter
public class ChatEstablishedEvent extends ApplicationEvent {
    private final String chatId;

    public ChatEstablishedEvent(Object source, String chatId) {
        super(source);
        this.chatId = chatId;
    }
}