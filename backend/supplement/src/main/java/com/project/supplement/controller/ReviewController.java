package com.project.supplement.controller;

import com.project.supplement.dto.response.reviewProductResponse;
import com.project.supplement.dto.response.reviewResponse;
import com.project.supplement.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/isReviewed")
    public boolean isProductReviewed(@RequestParam Long productId, @RequestParam Long userId){
        return reviewService.isReviewed(productId, userId);
    }

    @GetMapping
    public Page<reviewProductResponse> getProductReviews(@RequestParam Long productId,
                                                         @RequestParam(defaultValue = "0", required = false) int page,
                                                         @RequestParam(defaultValue = "5", required = false) int size){
        Pageable pageable = PageRequest.of(page, size);
        return reviewService.getReviews(productId, pageable);
    }

    @GetMapping("/comments/{productId}")
    public int getProductTotalComments(@PathVariable Long productId){
        return reviewService.getComments(productId);
    }

    @GetMapping("/rating/{productId}")
    public double getRating(@PathVariable Long productId){
        return reviewService.getRating(productId);
    }

    @GetMapping("/ratingCounts/{productId}")
    public Map<Integer, Integer> getRatingCounts(@PathVariable Long productId){
        return reviewService.getRatingCounts(productId);
    }

    @GetMapping("/userReviews/{userId}")
    public List<reviewResponse> getUserReviews(@PathVariable Long userId){
        return reviewService.getUserReviews(userId);
    }

    @PostMapping
    public void create(@RequestBody reviewResponse reviewResponse){
        reviewService.create(reviewResponse);
    }
}
