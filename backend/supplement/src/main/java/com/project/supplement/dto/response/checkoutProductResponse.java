package com.project.supplement.dto.response;

import com.project.supplement.entity.Checkout;
import com.project.supplement.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class checkoutProductResponse {
    private productResponse product;
    private Integer quantity;
}
