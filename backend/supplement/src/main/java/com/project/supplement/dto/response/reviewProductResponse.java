package com.project.supplement.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class reviewProductResponse {
    private String userName;
    private Long productId;
    private double rating;
    private String reviewDescription;
    private LocalDate reviewDate;
}
