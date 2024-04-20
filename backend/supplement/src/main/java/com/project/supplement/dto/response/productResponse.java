package com.project.supplement.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class productResponse {
    private Long id;
    private String name;
    private String title;
    private String blurhashImg;
    private String imageUrl;
    private Map<String, String> flavours;
    private List<String> ingredients;
    private BigDecimal price;
    private int weight;
    private int servingAmount;
    private int quantity;
    private String description;
    private String usageDescription;
    private Map<String, Double> nutritionFacts;
    private String categoryName;
}
