package com.project.supplement.entity;

import lombok.*;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "flavour")
public class Flavour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flavour_id", updatable = false, nullable = false)
    private Long id;

    private String name;

    private String color;

    @ManyToMany(mappedBy = "flavours")
    private List<Product> products;
}
