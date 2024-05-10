package com.project.supplement.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "checkout")
public class Checkout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "checkout_id", nullable = false, updatable = false)
    private Long id;

    @JsonFormat(pattern="dd-MM-yyyy")
    @Column(name = "checkout_date")
    private LocalDate checkoutDate;

    @JsonFormat(pattern="dd-MM-yyyy")
    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "price")
    private Long price;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "address_id")
    private Long addressId;

    @OneToMany(mappedBy = "checkout")
    private List<CheckoutProduct> checkoutProducts  = new ArrayList<>();;
}
