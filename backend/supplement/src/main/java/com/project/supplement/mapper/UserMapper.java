package com.project.supplement.mapper;

import com.project.supplement.dto.UserDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.User;
import org.modelmapper.ModelMapper;
import com.project.supplement.entity.Flavour;
import com.project.supplement.entity.NutritionFacts;

import java.util.stream.Collectors;

public class UserMapper {
    private ModelMapper modelMapper;

    public UserMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public UserDTO toUserDTO(User user) {
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);

        userDTO.setFavorites(user.getFavorites().stream().map(product -> {
            productResponse productResponse = modelMapper.map(product, productResponse.class);
            productResponse.setFlavours(product.getFlavours().stream().collect(Collectors.toMap(Flavour::getName, Flavour::getColor)));
            productResponse.setNutritionFacts(product.getNutritionFacts().stream().collect(Collectors.toMap(NutritionFacts::getNutrientName, NutritionFacts::getAmount)));
            productResponse.setCategoryName(product.getCategory().getName());
            return productResponse;
        }).collect(Collectors.toList()));

        return userDTO;
    }
}
