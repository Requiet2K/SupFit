package com.project.supplement.repository;

import com.project.supplement.entity.CheckoutProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutProductRepository extends JpaRepository<CheckoutProduct, Long> {
}
