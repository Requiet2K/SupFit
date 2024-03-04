package com.project.supplement.exception.custom_exceptions;

public class UserAlreadyExistsException extends RuntimeException{
    public UserAlreadyExistsException(){
        super("This email is already registered by another account!");
    }
}
