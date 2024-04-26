package com.project.supplement.service.impl;

import com.project.supplement.entity.Product;
import com.project.supplement.entity.User;
import com.project.supplement.exception.custom_exceptions.CartItemNotExistsException;
import com.project.supplement.exception.custom_exceptions.CartNotExistsException;
import com.project.supplement.exception.custom_exceptions.ProductNotExistsException;
import com.project.supplement.exception.custom_exceptions.UserNotExistsException;
import com.project.supplement.repository.CartItemRepository;
import com.project.supplement.repository.CartRepository;
import com.project.supplement.repository.ProductRepository;
import com.project.supplement.repository.UserRepository;
import com.project.supplement.service.CartService;
import org.springframework.stereotype.Service;
import com.project.supplement.entity.Cart;
import com.project.supplement.entity.CartItem;

import java.util.List;
import java.util.Optional;


@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository,
                           ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotExistsException::new);

        Product product = productRepository.findById(productId)
                .orElseThrow(ProductNotExistsException::new);

        Cart cart = user.getCart();
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            user.setCart(cart);
        }

        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().equals(product))
                .findFirst();

        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setCart(cart);
            cart.getItems().add(cartItem);
        }

        cartRepository.save(cart);
    }

    @Override
    public void removeFromCart(Long userId, Long cartItemId, int quantity) {

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotExistsException::new);

        Cart cart = user.getCart();

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(CartItemNotExistsException::new);

        if (cartItem.getQuantity() <= quantity) {
            cart.getItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() - quantity);
            cartItemRepository.save(cartItem);
        }
    }

    @Override
    public void emptyCart(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotExistsException::new);

        Cart cart = user.getCart();

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public List<CartItem> getCartItems(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotExistsException::new);

        Cart cart = user.getCart();

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            user.setCart(cart);
        }

        return cart.getItems();
    }
}
