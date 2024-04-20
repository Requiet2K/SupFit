package com.project.supplement.exception.custom_exceptions;

public class InvalidFlavourIdException extends RuntimeException{
    public InvalidFlavourIdException(){
        super("Flavour not found!");
    }
}
