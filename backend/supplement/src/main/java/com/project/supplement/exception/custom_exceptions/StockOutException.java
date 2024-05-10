package com.project.supplement.exception.custom_exceptions;

public class StockOutException extends RuntimeException{
    public StockOutException(){
        super("Stock not enough!");
    }
}
