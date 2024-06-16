package com.project.supplement.controller;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/carts")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<cartItemsDTO>> getItems(@PathVariable Long userId) {
        List<cartItemsDTO> items = cartService.getCartItems(userId);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @PostMapping("/increaseCartItem/{userId}")
    public ResponseEntity<Void> increaseCartItem(@PathVariable Long userId, @RequestParam int quantity, @RequestBody productResponse productResponse) {
        cartService.increaseCartItem(userId, productResponse, quantity);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/decreaseCartItem/{userId}")
    public ResponseEntity<Void> decreaseCartItem(@PathVariable Long userId, @RequestParam int quantity, @RequestBody productResponse productResponse) {
        cartService.decreaseCartItem(userId, productResponse, quantity);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/addToCart/{userId}")
    public ResponseEntity<Void> addToCart(@PathVariable Long userId, @RequestParam int quantity, @RequestBody productResponse productResponse) {
        cartService.addToCart(userId, productResponse, quantity);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/removeFromCart/{userId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long userId, @RequestBody productResponse productResponse) {
        cartService.removeFromCart(userId, productResponse);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/clearCart/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/handleUpdateQuantity/{userId}")
    public ResponseEntity<Void> handleUpdateQuantity(@PathVariable Long userId, @RequestParam int quantity, @RequestBody productResponse productResponse) {
        cartService.handleUpdateQuantity(userId, productResponse, quantity);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
