package com.project.supplement.service;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.dto.response.checkoutResponse;
import com.project.supplement.dto.response.productResponse;

import java.util.List;
import java.util.Set;

public interface CheckoutService {
    void createCheckout(Long userId, List<cartItemsDTO> cartItems, Long price, Long addressId);
    List<checkoutResponse> getCurrentOrders(Long userId);
    List<checkoutResponse> getPastOrders(Long userId);
    int getTotalOrderOfUserCount(Long userId);
    boolean isProductDelivered(Long userId, Long productId);
    Set<productResponse> bestSellers();
}
