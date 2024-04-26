package com.project.supplement.exception.custom_exceptions;

public class CartItemNotExistsException extends RuntimeException{
    public CartItemNotExistsException(){
        super("Cart Item not exists!");
    }
}
