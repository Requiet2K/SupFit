package com.project.supplement.exception.custom_exceptions;

public class NotExistsException extends RuntimeException{
    public NotExistsException(String msg){
        super(msg);
    }
}
