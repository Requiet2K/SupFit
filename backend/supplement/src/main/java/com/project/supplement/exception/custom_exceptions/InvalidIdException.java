package com.project.supplement.exception.custom_exceptions;

public class InvalidIdException extends RuntimeException{
    public InvalidIdException(String msg){
        super(msg);
    }
}
