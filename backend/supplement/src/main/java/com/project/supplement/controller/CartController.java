package com.project.supplement.controller;

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
    public List<CartItem> getItems(@PathVariable Long userId) {
        return cartService.getCartItems(userId);
    }

    @PutMapping("/addToCart")
    public void addToCart(@RequestParam Long userId, @RequestParam Long productId, @RequestParam int quantity) {
        cartService.addToCart(userId, productId, quantity);
    }

    @PutMapping("/removeFromCart")
    public void removeFromCart(@RequestParam Long userId, @RequestParam Long cartItemId, @RequestParam int quantity) {
        cartService.removeFromCart(userId, cartItemId, quantity);
    }

    @DeleteMapping("/emptyCart/{userId}")
    public void emptyCart(@PathVariable Long userId) {
        cartService.emptyCart(userId);
    }
}

