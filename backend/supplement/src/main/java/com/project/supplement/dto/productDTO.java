package com.project.supplement.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class productDTO {
    private String name;
    private String title;
    private String imageUrl;
    private List<String> flavors;
    private List<String> ingredients;
    private int price;
    private int weight;
    private int servingAmount;
    private int quantity;
    private String description;
    private String usageDescription;
    private Map<String, Double> nutritionFacts;
    private Long categoryId;
}
