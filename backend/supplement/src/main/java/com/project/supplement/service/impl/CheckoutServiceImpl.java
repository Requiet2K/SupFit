package com.project.supplement.service.impl;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.dto.response.checkoutProductResponse;
import com.project.supplement.dto.response.checkoutResponse;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.*;
import com.project.supplement.exception.custom_exceptions.*;
import com.project.supplement.mapper.ProductMapper;
import com.project.supplement.repository.*;
import com.project.supplement.service.CheckoutService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private final CheckoutRepository checkoutRepository;
    private final CheckoutProductRepository checkoutProductRepository;
    private final ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    public CheckoutServiceImpl(CheckoutRepository checkoutRepository, ProductMapper productMapper,
                               ProductRepository productRepository, AddressRepository addressRepository, CheckoutProductRepository checkoutProductRepository) {
        this.checkoutRepository = checkoutRepository;
        this.productMapper = productMapper;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.checkoutProductRepository = checkoutProductRepository;
    }

    @Override
    public void createCheckout(Long userId, List<cartItemsDTO> cartItems, Long price, Long addressId) {

        Checkout checkout = new Checkout();

        checkout.setUserId(userId);
        checkout.setPrice(price);
        checkout.setAddressId(addressId);
        checkout.setCheckoutDate(LocalDate.now());
        checkout.setDeliveryDate(LocalDate.now().plusDays(2));

        checkoutRepository.save(checkout);

        for(cartItemsDTO c : cartItems){

            Product product = productRepository.findById(c.getProduct().getId())
                    .orElseThrow(ProductNotExistsException::new);

            if(product.getQuantity() - c.getQuantity() < 0){
                throw new StockOutException();
            }else{
                product.setQuantity(product.getQuantity() - c.getQuantity());
                productRepository.save(product);
            }

            CheckoutProduct checkoutProduct = new CheckoutProduct();
            checkoutProduct.setCheckout(checkout);
            checkoutProduct.setProduct(product);
            checkoutProduct.setQuantity(c.getQuantity());

            checkout.getCheckoutProducts().add(checkoutProduct);
            checkoutProductRepository.save(checkoutProduct);
        }
        checkoutRepository.save(checkout);
    }

    @Override
    public List<checkoutResponse> getCurrentOrders(Long userId) {

        List<Checkout> checkouts = checkoutRepository.findAllByUserId(userId);
        List<checkoutResponse> checkoutResponses = new ArrayList<>();

        LocalDate currentDate = LocalDate.now();

        for(Checkout c : checkouts){
            if(c.getDeliveryDate().isAfter(currentDate)){

                checkoutResponse checkoutResponse = new checkoutResponse();

                checkoutResponse.setId(c.getId());
                checkoutResponse.setCheckoutDate(c.getCheckoutDate());
                checkoutResponse.setDeliveryDate(c.getDeliveryDate());
                checkoutResponse.setPrice(c.getPrice());

                Address address = addressRepository.findById(c.getAddressId())
                        .orElseThrow(AddressNotExistsException::new);

                checkoutResponse.setAddress(address);

                List<checkoutProductResponse> productResponses = new ArrayList<>();
                List<CheckoutProduct> checkoutProducts = c.getCheckoutProducts();

                for(CheckoutProduct cp : checkoutProducts){
                    productResponse productResponse = productMapper.toProductResponse(cp.getProduct());
                    checkoutProductResponse checkoutProductResponse = new checkoutProductResponse();
                    checkoutProductResponse.setProduct(productResponse);
                    checkoutProductResponse.setQuantity(cp.getQuantity());
                    productResponses.add(checkoutProductResponse);
                }

                checkoutResponse.setProducts(productResponses);

                checkoutResponses.add(checkoutResponse);
            }
        }

        return checkoutResponses;
    }

    @Override
    public List<checkoutResponse> getPastOrders(Long userId) {
        List<Checkout> checkouts = checkoutRepository.findAllByUserId(userId);
        List<checkoutResponse> checkoutResponses = new ArrayList<>();

        LocalDate currentDate = LocalDate.now();

        for(Checkout c : checkouts){
            if(c.getDeliveryDate().isBefore(currentDate) || c.getDeliveryDate().isEqual(currentDate)){

                checkoutResponse checkoutResponse = new checkoutResponse();

                checkoutResponse.setId(c.getId());
                checkoutResponse.setCheckoutDate(c.getCheckoutDate());
                checkoutResponse.setDeliveryDate(c.getDeliveryDate());
                checkoutResponse.setPrice(c.getPrice());

                Address address = addressRepository.findById(c.getAddressId())
                        .orElseThrow(AddressNotExistsException::new);

                checkoutResponse.setAddress(address);

                List<checkoutProductResponse> productResponses = new ArrayList<>();
                List<CheckoutProduct> checkoutProducts = c.getCheckoutProducts();

                for(CheckoutProduct cp : checkoutProducts){
                    productResponse productResponse = productMapper.toProductResponse(cp.getProduct());
                    checkoutProductResponse checkoutProductResponse = new checkoutProductResponse();
                    checkoutProductResponse.setProduct(productResponse);
                    checkoutProductResponse.setQuantity(cp.getQuantity());
                    productResponses.add(checkoutProductResponse);
                }

                checkoutResponse.setProducts(productResponses);

                checkoutResponses.add(checkoutResponse);
            }
        }

        return checkoutResponses;
    }

    @Override
    public int getTotalOrderOfUserCount(Long userId){
        List<Checkout> checkouts = checkoutRepository.findAllByUserId(userId);
        return checkouts.size();
    }

    @Override
    public boolean isProductDelivered(Long userId, Long productId) {
        List<Checkout> checkouts = checkoutRepository.findAllByUserId(userId);

        LocalDate currentDate = LocalDate.now();

        for(Checkout c : checkouts){
            if((c.getDeliveryDate().isBefore(currentDate) || c.getDeliveryDate().isEqual(currentDate))){
                for(CheckoutProduct cp : c.getCheckoutProducts()){
                    if(Objects.equals(cp.getProduct().getId(), productId)) return true;
                }
            }
        }

        return false;
    }

}
