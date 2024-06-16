package com.project.supplement.controller;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.dto.response.checkoutResponse;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/checkouts")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping("/{userId}")
    public ResponseEntity<Void> createCheckout(@PathVariable Long userId,
                                               @RequestBody List<cartItemsDTO> products,
                                               @RequestParam Long price,
                                               @RequestParam Long addressId) {
        checkoutService.createCheckout(userId, products, price, addressId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/currentOrders/{userId}")
    public ResponseEntity<List<checkoutResponse>> getCurrentOrders(@PathVariable Long userId) {
        List<checkoutResponse> currentOrders = checkoutService.getCurrentOrders(userId);
        return ResponseEntity.ok(currentOrders);
    }

    @GetMapping("/pastOrders/{userId}")
    public ResponseEntity<List<checkoutResponse>> getPastOrders(@PathVariable Long userId) {
        List<checkoutResponse> pastOrders = checkoutService.getPastOrders(userId);
        return ResponseEntity.ok(pastOrders);
    }

    @GetMapping("/totalOrder/{userId}")
    public ResponseEntity<Integer> getTotalOrderOfUserCount(@PathVariable Long userId) {
        int totalOrderCount = checkoutService.getTotalOrderOfUserCount(userId);
        return ResponseEntity.ok(totalOrderCount);
    }

    @GetMapping("/isDelivered")
    public ResponseEntity<Boolean> isProductDelivered(@RequestParam Long userId,
                                                      @RequestParam Long productId) {
        boolean delivered = checkoutService.isProductDelivered(userId, productId);
        return ResponseEntity.ok(delivered);
    }

    @GetMapping("/bestSellers")
    public ResponseEntity<Set<productResponse>> bestSellers() {
        Set<productResponse> bestSellers = checkoutService.bestSellers();
        return ResponseEntity.ok(bestSellers);
    }
}
