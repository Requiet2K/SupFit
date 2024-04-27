package com.project.supplement.service;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.entity.CartItem;

import java.util.List;

public interface CartService {
    void updateCartItems(Long userId, List<cartItemsDTO> cartItems);
    List<cartItemsDTO> getCartItems(Long userId);
}
