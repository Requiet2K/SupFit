package com.project.supplement.service.impl;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.*;
import com.project.supplement.exception.custom_exceptions.*;
import com.project.supplement.mapper.ProductMapper;
import com.project.supplement.repository.*;
import com.project.supplement.service.CartService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository,
                           ProductRepository productRepository, UserRepository userRepository, ProductMapper productMapper, CategoryRepository categoryRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productMapper = productMapper;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void updateCartItems(Long userId, List<cartItemsDTO> cartItems) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotExistsException::new);

        Cart cart = user.getCart();

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            user.setCart(cart);
        }

        List<CartItem> cartItemsList = new ArrayList<>(cart.getItems());


        for (cartItemsDTO cartItemDTO : cartItems) {

            Category category = categoryRepository.findByName(cartItemDTO.getProduct().getCategoryName())
                    .orElseThrow(InvalidCategoryIdException::new);
            Product product = productMapper.toProductEntity(cartItemDTO.getProduct(), category);

            boolean foundInCart = false;

            for (CartItem existingItem : cartItemsList) {
                if (existingItem.getProduct().getId().equals(product.getId())) {
                    existingItem.setQuantity(cartItemDTO.getQuantity());
                    foundInCart = true;
                    break;
                }
            }

            if (!foundInCart) {
                CartItem newCartItem = new CartItem();
                newCartItem.setProduct(product);
                newCartItem.setQuantity(cartItemDTO.getQuantity());
                newCartItem.setCart(cart);
                cartItemsList.add(newCartItem);
            }
        }

        cart.setItems(cartItemsList);
        cartRepository.save(cart);
    }

    @Override
    public List<cartItemsDTO> getCartItems(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotExistsException::new);

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
}
