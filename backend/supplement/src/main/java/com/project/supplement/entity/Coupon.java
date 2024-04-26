package com.project.supplement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Coupon")
public class Coupon {
    @Id
    private String code;
    private double discount;
}
