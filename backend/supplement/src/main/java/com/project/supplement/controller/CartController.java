package com.project.supplement.controller;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.entity.CartItem;
import com.project.supplement.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    @GetMapping("/getItems/{userId}")
    public List<cartItemsDTO> getItems(@PathVariable Long userId) {
        return cartService.getCartItems(userId);
    }

    @PostMapping("/updateCart/{userId}")
    public void updateCart(@PathVariable Long userId, @RequestBody List<cartItemsDTO> cartItems) {
        cartService.updateCartItems(userId, cartItems);
    }
}

