package com.project.supplement.dto.response;

import com.project.supplement.entity.Address;
import com.project.supplement.entity.Product;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class checkoutResponse {
    private Long id;
    private LocalDate checkoutDate;
    private LocalDate deliveryDate;
    private Long price;
    private Long quantity;
    private Address address;
    private List<checkoutProductResponse> products;
}
