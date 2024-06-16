package com.project.supplement.chatbot.config;

import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatbotConfig {

    @Bean
    OllamaOptions ollamaOptions() {
        return new OllamaOptions()
                .withModel("llama3")
                .withTemperature(0.6F)
                .withTopK(2);
    }

    @Bean
    OllamaChatModel ollamaChatClient(OllamaOptions ollamaOptions) {
        return new OllamaChatModel(new OllamaApi("http://localhost:11434"));

    }
}
