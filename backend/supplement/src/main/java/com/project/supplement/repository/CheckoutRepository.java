package com.project.supplement.repository;

import com.project.supplement.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    List<Checkout> findAllByUserId(Long userId);
}
