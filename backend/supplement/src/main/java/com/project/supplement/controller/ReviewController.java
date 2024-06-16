package com.project.supplement.controller;

import com.project.supplement.dto.response.reviewProductResponse;
import com.project.supplement.dto.response.reviewResponse;
import com.project.supplement.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/isReviewed")
    public ResponseEntity<Boolean> isProductReviewed(@RequestParam Long productId, @RequestParam Long userId) {
        boolean reviewed = reviewService.isReviewed(productId, userId);
        return ResponseEntity.ok(reviewed);
    }

    @GetMapping
    public ResponseEntity<Page<reviewProductResponse>> getProductReviews(@RequestParam Long productId,
                                                                         @RequestParam(defaultValue = "0", required = false) int page,
                                                                         @RequestParam(defaultValue = "5", required = false) int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<reviewProductResponse> reviews = reviewService.getReviews(productId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/comments/{productId}")
    public ResponseEntity<Integer> getProductTotalComments(@PathVariable Long productId) {
        int totalComments = reviewService.getComments(productId);
        return ResponseEntity.ok(totalComments);
    }

    @GetMapping("/rating/{productId}")
    public ResponseEntity<Double> getRating(@PathVariable Long productId) {
        double rating = reviewService.getRating(productId);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/ratingCounts/{productId}")
    public ResponseEntity<Map<Integer, Integer>> getRatingCounts(@PathVariable Long productId) {
        Map<Integer, Integer> ratingCounts = reviewService.getRatingCounts(productId);
        return ResponseEntity.ok(ratingCounts);
    }

    @GetMapping("/userReviews/{userId}")
    public ResponseEntity<List<reviewResponse>> getUserReviews(@PathVariable Long userId) {
        List<reviewResponse> userReviews = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(userReviews);
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody reviewResponse reviewResponse) {
        reviewService.create(reviewResponse);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
