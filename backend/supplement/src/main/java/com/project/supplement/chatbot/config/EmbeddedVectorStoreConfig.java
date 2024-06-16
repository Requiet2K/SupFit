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
        // It's like you using H2 database for your application when making some demo
        // VectorStore is also the same case
        return new SimpleVectorStore(embeddingModel);
    }
}
