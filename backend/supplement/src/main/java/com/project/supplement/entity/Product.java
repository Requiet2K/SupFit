package com.project.supplement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id", updatable = false, nullable = false)
    private Long id;

    private String name;

    private String title;

    private String imageUrl;

    @Column(name = "blurhash_img")
    private String blurhashImg;

    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "productNutritionFacts")
    private List<NutritionFacts> NutritionFacts;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonBackReference(value = "productCategory")
    private Category category;

    private BigDecimal price;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinTable(
            name = "product_flavour",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "flavour_id")
    )
    @JsonBackReference(value = "productFlavours")
    private List<Flavour> flavours;

    @ElementCollection
    private List<String> ingredients;

    private int weight;

    @Column(name = "serving_amount")
    private int servingAmount;

    private int quantity;

    private String description;

    private String usageDescription;

    @ManyToMany(mappedBy = "favorites")
    private List<User> favoritedByUsers;

    @OneToMany(mappedBy = "product")
    private List<CheckoutProduct> checkoutProducts;
}
