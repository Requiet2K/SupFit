package com.project.supplement.exception.custom_exceptions;

public class AddressNotExistsException extends RuntimeException{
    public AddressNotExistsException(){
        super("Address not found!");
    }
}
