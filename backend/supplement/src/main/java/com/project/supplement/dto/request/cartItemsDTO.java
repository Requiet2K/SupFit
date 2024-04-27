package com.project.supplement.dto.request;

import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.Product;
import lombok.*;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class cartItemsDTO {
    private Long id;
    private productResponse product;
    private int quantity;
}
