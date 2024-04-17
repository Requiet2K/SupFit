package com.project.supplement.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id", updatable = false, nullable = false)
    private Long id;

    private String name;

    private String title;

    private String imageUrl;

    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<NutritionFacts> NutritionFacts;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private int price;

    @ElementCollection
    private List<String> flavors;

    @ElementCollection
    private List<String> ingredients;

    private int weight;

    @Column(name = "serving_amount")
    private int servingAmount;

    private int quantity;

    private String description;

    private String usageDescription;
}
