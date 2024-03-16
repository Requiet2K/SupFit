package com.project.supplement.exception.custom_exceptions;

public class PasswordIncorrectException extends RuntimeException{
    public PasswordIncorrectException(){
        super("Current password is incorrect!");
    }
}
