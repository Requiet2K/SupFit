package com.project.supplement.service;

import com.project.supplement.dto.response.reviewProductResponse;
import com.project.supplement.dto.response.reviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface ReviewService {
    boolean isProductReviewed(Long productId, Long userId);
    Page<reviewProductResponse> getProductReviews(Long productId, Pageable pageable);
    void createReview(reviewResponse reviewResponse);
    List<reviewResponse> getUserReviews(Long userId);
    int getProductTotalComments(Long productId);
    double getProductRating(Long productId);
    Map<Integer, Integer> getRatingCounts(Long productId);
}
