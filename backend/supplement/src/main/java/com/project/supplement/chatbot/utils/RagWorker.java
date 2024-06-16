package com.project.supplement.chatbot.utils;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

@Component
@RequiredArgsConstructor
public class RagWorker {

    private final VectorStore vectorStore;

    @PostConstruct
    public void processDirectory() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:/data/**/*");

        List<Document> documentsToAdd = new ArrayList<>();
        for (Resource resource : resources) {
            String text = Files.readString(resource.getFile().toPath());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("filename", resource.getFilename());

            Document document = new Document(
                    text,
                    resource.getFilename(),
                    metadata
            );
            documentsToAdd.add(document);
        }

        vectorStore.add(documentsToAdd);
    }
}