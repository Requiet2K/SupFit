package com.project.supplement.dto.request;

import com.project.supplement.entity.Flavour;
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
public class productDTO {
    private String name;
    private String title;
    private String blurhashImg;
    private String imageUrl;
    private List<Long> flavourIds;
    private List<String> ingredients;
    private BigDecimal price;
    private int weight;
    private int servingAmount;
    private int quantity;
    private String description;
    private String usageDescription;
    private Map<String, Double> nutritionFacts;
    private Long categoryId;
}
