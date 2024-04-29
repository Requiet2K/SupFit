package com.project.supplement.repository;

import com.project.supplement.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    void deleteByCartIdAndProductId(Long cartId, Long productId);
    void deleteAllByCartId(Long cartId);
}
