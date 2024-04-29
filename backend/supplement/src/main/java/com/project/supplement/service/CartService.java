package com.project.supplement.service;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.CartItem;

import java.util.List;

public interface CartService {
    void increaseCartItem(Long userId, productResponse productResponse, int quantity);
    void decreaseCartItem(Long userId, productResponse productResponse, int quantity);
    List<cartItemsDTO> getCartItems(Long userId);
    void addToCart(Long userId, productResponse productResponse, int quantity);
    void removeFromCart(Long userId, productResponse productResponse);
    void clearCart(Long userId);
    void handleUpdateQuantity(Long userId, productResponse productResponse, int quantity);
}
