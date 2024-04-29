package com.project.supplement.controller;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.dto.response.productResponse;
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

    @PostMapping("/increaseCartItem/{userId}")
    public void increaseCartItem(@PathVariable Long userId, @RequestParam int quantity, @RequestBody productResponse productResponse) {
        cartService.increaseCartItem(userId, productResponse, quantity);
    }

    @PostMapping("/decreaseCartItem/{userId}")
    public void decreaseCartItem(@PathVariable Long userId, @RequestParam int quantity, @RequestBody productResponse productResponse) {
        cartService.decreaseCartItem(userId, productResponse, quantity);
    }

    @PutMapping("/addToCart/{userId}")
    public void addToCart(@PathVariable Long userId, @RequestParam int quantity, @RequestBody productResponse productResponse){
        cartService.addToCart(userId, productResponse, quantity);
    }

    @DeleteMapping("/removeFromCart/{userId}")
    public void removeFromCart(@PathVariable Long userId,@RequestBody productResponse productResponse){
        cartService.removeFromCart(userId, productResponse);
    }

    @DeleteMapping("/clearCart/{userId}")
    public void removeFromCart(@PathVariable Long userId){
        cartService.clearCart(userId);
    }

    @PutMapping("/handleUpdateQuantity/{userId}")
    public void handleUpdateQuantity(@PathVariable Long userId, @RequestParam int quantity, @RequestBody productResponse productResponse) {
        cartService.handleUpdateQuantity(userId, productResponse, quantity);
    }

}

