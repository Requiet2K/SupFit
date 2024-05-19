package com.project.supplement.controller;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.dto.response.checkoutResponse;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/checkouts")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping("/createCheckout/{userId}")
    public void createCheckout(@PathVariable Long userId, @RequestBody List<cartItemsDTO> products, @RequestParam Long price, @RequestParam Long addressId){
        checkoutService.createCheckout(userId, products, price, addressId);
    }

    @GetMapping("/getCurrentOrders/{userId}")
    public List<checkoutResponse> getCurrentOrders(@PathVariable Long userId){
        return checkoutService.getCurrentOrders(userId);
    }

    @GetMapping("/getPastOrders/{userId}")
    public List<checkoutResponse> getPastOrders(@PathVariable Long userId){
        return checkoutService.getPastOrders(userId);
    }

    @GetMapping("/getTotalOrderOfUserCount/{userId}")
    public int getTotalOrderOfUserCount(@PathVariable Long userId){
        return checkoutService.getTotalOrderOfUserCount(userId);
    }

    @GetMapping("/isProductDelivered")
    public boolean isProductDelivered(@RequestParam Long userId, @RequestParam Long productId){
        return checkoutService.isProductDelivered(userId, productId);
    }

    @GetMapping("/bestSellers")
    public Set<productResponse> bestSellers(){
        return checkoutService.bestSellers();
    }
}
