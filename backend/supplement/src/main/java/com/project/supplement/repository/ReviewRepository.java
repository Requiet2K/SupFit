package com.project.supplement.repository;

import com.project.supplement.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByProductIdAndUserId(Long productId, Long userId);
    Page<Review> findByProductId(Long productId,Pageable pageable);
    List<Review> findByProductId(Long productId);
    List<Review> findAllByUserId(Long userId);
}
