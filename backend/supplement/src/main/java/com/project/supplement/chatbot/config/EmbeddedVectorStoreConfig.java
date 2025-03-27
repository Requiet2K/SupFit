package com.project.supplement.chatbot.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.ollama.OllamaEmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class EmbeddedVectorStoreConfig {

    @Bean
    VectorStore vectorStore(OllamaEmbeddingModel embeddingModel) {
        return new SimpleVectorStore(embeddingModel);
    }
}
