package com.project.supplement.helper;

import org.springframework.stereotype.Component;

@Component
public class NameConverter {
    public String nameConverter(String name){
        name = name.substring(0,1).toUpperCase() + name.substring(1);
        return name;
    }
}
