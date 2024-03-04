package com.project.supplement.exception.custom_exceptions;

public class UserNotExistsException extends RuntimeException{
    public UserNotExistsException(){
        super("This email is not related with any account!");
    }
}
