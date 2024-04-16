package com.project.supplement.exception.custom_exceptions;

public class InvalidCategoryIdException extends RuntimeException{
    public InvalidCategoryIdException(){
        super("Category not found!");
    }
}
