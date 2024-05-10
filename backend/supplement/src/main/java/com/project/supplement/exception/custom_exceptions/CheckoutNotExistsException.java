package com.project.supplement.exception.custom_exceptions;

public class CheckoutNotExistsException extends RuntimeException{
    public CheckoutNotExistsException(){
        super("Checkout not exists!");
    }
}
