package com.project.supplement.service.impl;

import com.project.supplement.dto.response.reviewProductResponse;
import com.project.supplement.dto.response.reviewResponse;
import com.project.supplement.entity.Product;
import com.project.supplement.entity.Review;
import com.project.supplement.entity.User;
import com.project.supplement.exception.custom_exceptions.NotExistsException;
import com.project.supplement.repository.*;
import com.project.supplement.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.*;

@Service
public class ReviewServiceImpl implements ReviewService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public ReviewServiceImpl(ProductRepository productRepository, UserRepository userRepository,
                             ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public Page<reviewProductResponse> getReviews(Long productId, Pageable pageable){
        Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);

        return reviews.map(review -> {
            reviewProductResponse reviewProductResponse = new reviewProductResponse();
            reviewProductResponse.setProductId(review.getProduct().getId());
            reviewProductResponse.setUserName(review.getUser().getFirstName()+" "+review.getUser().getLastName().charAt(0)+".");
            reviewProductResponse.setReviewDate(review.getReviewDate());
            reviewProductResponse.setReviewDescription(review.getReviewDescription());
            reviewProductResponse.setRating(review.getRating());
            return reviewProductResponse;
        });
    }

    @Override
    public int getComments(Long productId){
        List<Review> reviews = reviewRepository.findByProductId(productId);
        int result = 0;
        for(Review r : reviews){
            if(!r.getReviewDescription().isEmpty()) result++;
        }
        return result;
    }

    @Override
    public double getRating(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        double rating = 0;
        if(reviews.isEmpty()) return 0;
        for(Review r : reviews){
            rating += r.getRating();
        }
        double averageRating = rating / reviews.size();

        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.US);
        DecimalFormat df = new DecimalFormat("#.#", symbols);
        return Double.parseDouble(df.format(averageRating));
    }

    @Override
    public Map<Integer, Integer> getRatingCounts(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        Map<Integer, Integer> ratingCounts = new HashMap<>();

        for (int i = 1; i <= 5; i++) {
            ratingCounts.put(i, 0);
        }

        for (Review r : reviews) {
            int roundedRating = (int) Math.ceil(r.getRating());
            ratingCounts.put(roundedRating, ratingCounts.get(roundedRating) + 1);
        }

        for (int i = 1; i <= 4; i++) {
            int halfRatingCount = ratingCounts.get(i + 0.5) != null ? ratingCounts.get(i + 0.5) : 0;
            ratingCounts.put(i, ratingCounts.get(i) + halfRatingCount);
            ratingCounts.remove(i + 0.5);
        }

        return ratingCounts;
    }

    @Override
    public boolean isReviewed(Long productId, Long userId) {

        Product product = productRepository.findById(productId).orElseThrow(() -> new NotExistsException("Product not exists! "+productId));
        User user = userRepository.findById(userId).orElseThrow(() -> new NotExistsException("User not exists! "+userId));

        Optional<Review> review = reviewRepository.findByProductIdAndUserId(productId, userId);

        return review.isPresent();
    }

    @Override
    public void create(reviewResponse reviewResponse) {

        Product product = productRepository.findById(reviewResponse.getProductId()).orElseThrow(() -> new NotExistsException("Product not exists!"));
        User user = userRepository.findById(reviewResponse.getUserId()).orElseThrow(() -> new NotExistsException("User not exists!"));

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(reviewResponse.getRating());
        review.setReviewDate(reviewResponse.getReviewDate());
        review.setReviewDescription(reviewResponse.getReviewDescription());
        reviewRepository.save(review);

    }

    public List<reviewResponse> getUserReviews(Long userId){

        User user = userRepository.findById(userId).orElseThrow(() -> new NotExistsException("User not exists! "+userId));
        List<Review> reviews = reviewRepository.findAllByUserId(userId);

        List<reviewResponse> reviewReturn = new ArrayList<>();

        for(Review r : reviews){
            reviewResponse reviewResponse = new reviewResponse();
            reviewResponse.setProductId(r.getProduct().getId());
            reviewResponse.setUserId(r.getUser().getId());
            reviewResponse.setReviewDate(r.getReviewDate());
            reviewResponse.setReviewDescription(r.getReviewDescription());
            reviewResponse.setRating(r.getRating());
            reviewReturn.add(reviewResponse);
        }
        return reviewReturn;
    }
}
