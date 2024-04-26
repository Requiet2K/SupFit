package com.project.supplement.exception.custom_exceptions;

public class CartNotExistsException extends RuntimeException{
    public CartNotExistsException(){
        super("Cart not exists!");
    }
}
