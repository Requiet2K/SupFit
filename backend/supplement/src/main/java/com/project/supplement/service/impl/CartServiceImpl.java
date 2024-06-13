package com.project.supplement.service.impl;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.*;
import com.project.supplement.exception.custom_exceptions.InvalidIdException;
import com.project.supplement.exception.custom_exceptions.NotExistsException;
import com.project.supplement.mapper.ProductMapper;
import com.project.supplement.repository.*;
import com.project.supplement.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository,
                           UserRepository userRepository, ProductMapper productMapper, CategoryRepository categoryRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productMapper = productMapper;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void increaseCartItem(Long userId, productResponse productResponse, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!" + userId));

        Cart cart = user.getCart();

        List<CartItem> cartItemsList = new ArrayList<>(cart.getItems());

        for (CartItem existingItem : cartItemsList) {
            if (existingItem.getProduct().getId().equals(productResponse.getId())) {
                if(existingItem.getQuantity() + quantity <= productResponse.getQuantity()){
                    existingItem.setQuantity(existingItem.getQuantity() + quantity);
                }else{
                    existingItem.setQuantity(productResponse.getQuantity());
                }
                break;
            }
        }

        cart.setItems(cartItemsList);
        cartRepository.save(cart);
    }

    @Override
    public void decreaseCartItem(Long userId, productResponse productResponse, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!" + userId));

        Cart cart = user.getCart();

        List<CartItem> cartItemsList = new ArrayList<>(cart.getItems());

        for (CartItem existingItem : cartItemsList) {
            if (existingItem.getProduct().getId().equals(productResponse.getId())) {
                if(existingItem.getQuantity() - quantity >= 1){
                    existingItem.setQuantity(existingItem.getQuantity() - quantity);
                }else{
                    existingItem.setQuantity(1);
                }
                break;
            }
        }

        cart.setItems(cartItemsList);
        cartRepository.save(cart);
    }

    @Override
    public List<cartItemsDTO> getCartItems(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!" + userId));

        Cart cart = user.getCart();

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            user.setCart(cart);
        }

        List<cartItemsDTO> cartItemDtos = new ArrayList<>();

        cart.getItems().forEach((item) -> {
            cartItemsDTO cartItemDTO = new cartItemsDTO();
            cartItemDTO.setId(item.getId());
            cartItemDTO.setQuantity(item.getQuantity());
            productResponse productResponse = productMapper.toProductResponse(item.getProduct());
            cartItemDTO.setProduct(productResponse);
            cartItemDtos.add(cartItemDTO);
        });

        return cartItemDtos;
    }

    @Override
    public void addToCart(Long userId, productResponse productResponse, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!" + userId));

        Cart cart = user.getCart();

        if(cart == null){
            Cart newCart = new Cart();
            user.setCart(newCart);
            newCart.setUser(user);
        }

        List<CartItem> cartItemsList = new ArrayList<>(cart.getItems());

        boolean foundInCart = false;

        for (CartItem existingItem : cartItemsList) {
            if (existingItem.getProduct().getId().equals(productResponse.getId())) {
                if(existingItem.getQuantity() + quantity <= existingItem.getProduct().getQuantity()){
                    existingItem.setQuantity(existingItem.getQuantity() + quantity);
                }else{
                    existingItem.setQuantity(existingItem.getProduct().getQuantity());
                }
                foundInCart = true;
                break;
            }
        }

        if (!foundInCart) {
            CartItem newCartItem = new CartItem();
            Category category = categoryRepository.findByName(productResponse.getCategoryName())
                    .orElseThrow(() -> new InvalidIdException("Invalid category!" + productResponse.getCategoryName()));
            Product product = productMapper.toProductEntity(productResponse, category);
            newCartItem.setProduct(product);
            if(quantity < product.getQuantity()){
                newCartItem.setQuantity(quantity);
            }else{
                newCartItem.setQuantity(product.getQuantity());
            }
            newCartItem.setCart(cart);
            cartItemsList.add(newCartItem);
        }

        cart.setItems(cartItemsList);
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void removeFromCart(Long userId, productResponse productResponse) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!" + userId));

        Cart cart = user.getCart();

        List<CartItem> cartItemsList = new ArrayList<>(cart.getItems());

        for (CartItem existingItem : cartItemsList) {
            if (existingItem.getProduct().getId().equals(productResponse.getId())) {
                cartItemsList.remove(existingItem);
                break;
            }
        }

        cartItemRepository.deleteByCartIdAndProductId(cart.getId(), productResponse.getId());
        cart.setItems(cartItemsList);
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!" + userId));

        Cart cart = user.getCart();
        cart.getItems().clear();

        cartItemRepository.deleteAllByCartId(cart.getId());
        cartRepository.save(cart);
    }

    @Override
    public void handleUpdateQuantity(Long userId, productResponse productResponse, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!" + userId));

        Cart cart = user.getCart();

        List<CartItem> cartItemsList = new ArrayList<>(cart.getItems());

        for (CartItem existingItem : cartItemsList) {
            if (existingItem.getProduct().getId().equals(productResponse.getId())) {
                if(quantity <= productResponse.getQuantity() && quantity > 1){
                    existingItem.setQuantity(quantity);
                }else if(quantity <= 1){
                    existingItem.setQuantity(1);
                }else {
                    existingItem.setQuantity(productResponse.getQuantity());
                }
                break;
            }
        }

        cart.setItems(cartItemsList);
        cartRepository.save(cart);
    }

}
