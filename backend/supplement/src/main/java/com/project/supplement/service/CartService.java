package com.project.supplement.service;

import com.project.supplement.entity.CartItem;

import java.util.List;

public interface CartService {
    void addToCart(Long userId, Long productId, int quantity);
    void removeFromCart(Long userId, Long cartItemId, int quantity);
    void emptyCart(Long userId);
    List<CartItem> getCartItems(Long userId);
}
