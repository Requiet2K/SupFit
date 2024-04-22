package com.project.supplement.mapper;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper getModelMapper(){
        ModelMapper theModelMapper = new ModelMapper();
        theModelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return theModelMapper;
    }

    @Bean
    public ProductMapper getProductMapper(ModelMapper modelMapper){
        return new ProductMapper(modelMapper);
    }

    @Bean
    public UserMapper getUserMapper(ModelMapper modelMapper){
        return new UserMapper(modelMapper);
    }
}
