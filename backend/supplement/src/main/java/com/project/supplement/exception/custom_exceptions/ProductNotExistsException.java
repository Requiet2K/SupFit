package com.project.supplement.exception.custom_exceptions;

public class ProductNotExistsException extends RuntimeException{
    public ProductNotExistsException(){
        super("Product not found!");
    }
}
