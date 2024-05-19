package com.project.supplement.service;

import com.project.supplement.dto.response.reviewProductResponse;
import com.project.supplement.dto.response.reviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface ReviewService {
    boolean isReviewed(Long productId, Long userId);
    Page<reviewProductResponse> getReviews(Long productId, Pageable pageable);
    void create(reviewResponse reviewResponse);
    List<reviewResponse> getUserReviews(Long userId);
    int getComments(Long productId);
    double getRating(Long productId);
    Map<Integer, Integer> getRatingCounts(Long productId);
}
