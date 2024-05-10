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
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/isProductReviewed")
    public boolean isProductReviewed(@RequestParam Long productId, @RequestParam Long userId){
        return reviewService.isProductReviewed(productId, userId);
    }

    @GetMapping("/getProductReviews")
    public Page<reviewProductResponse> getProductReviews(@RequestParam Long productId,
                                                         @RequestParam(defaultValue = "0", required = false) int page,
                                                         @RequestParam(defaultValue = "5", required = false) int size){
        Pageable pageable = PageRequest.of(page, size);
        return reviewService.getProductReviews(productId, pageable);
    }

    @GetMapping("/getProductTotalComments/{productId}")
    public int getProductTotalComments(@PathVariable Long productId){
        return reviewService.getProductTotalComments(productId);
    }

    @GetMapping("/getProductRating/{productId}")
    public double getProductRating(@PathVariable Long productId){
        return reviewService.getProductRating(productId);
    }

    @GetMapping("/getRatingCounts/{productId}")
    public Map<Integer, Integer> getRatingCounts(@PathVariable Long productId){
        return reviewService.getRatingCounts(productId);
    }

    @GetMapping("/getUserReviews/{userId}")
    public List<reviewResponse> getUserReviews(@PathVariable Long userId){
        return reviewService.getUserReviews(userId);
    }

    @PostMapping("/createReview")
    public void createReview(@RequestBody reviewResponse reviewResponse){
        reviewService.createReview(reviewResponse);
    }
}
