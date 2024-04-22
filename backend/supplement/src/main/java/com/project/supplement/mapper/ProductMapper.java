package com.project.supplement.mapper;

import com.project.supplement.dto.request.productDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.Category;
import com.project.supplement.entity.Product;
import org.modelmapper.ModelMapper;
import com.project.supplement.entity.Flavour;
import com.project.supplement.entity.NutritionFacts;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProductMapper {

    private ModelMapper modelMapper;

    public ProductMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public Product toProductEntity(productDTO productRequest, Category category, List<Flavour> flavours) {
        Product product = modelMapper.map(productRequest, Product.class);

        List<NutritionFacts> nutritionFactsList = productRequest.getNutritionFacts().entrySet().stream()
                .map(entry -> {
                    NutritionFacts nutritionFacts = new NutritionFacts();
                    nutritionFacts.setNutrientName(entry.getKey());
                    nutritionFacts.setAmount(entry.getValue());
                    nutritionFacts.setProduct(product);
                    return nutritionFacts;
                })
                .collect(Collectors.toList());

        product.setNutritionFacts(nutritionFactsList);
        product.setCategory(category);
        product.setFlavours(flavours);

        return product;
    }

    public productResponse toProductResponse(Product product) {
        productResponse productResponse = modelMapper.map(product, productResponse.class);

        productResponse.setNutritionFacts(product.getNutritionFacts().stream()
                .collect(Collectors.toMap(NutritionFacts::getNutrientName, NutritionFacts::getAmount)));
        productResponse.setCategoryName(product.getCategory().getName());

        Map<String, String> flavourMap = new HashMap<>();
        for (Flavour flavour : product.getFlavours()) {
            flavourMap.put(flavour.getName(), flavour.getColor());
        }

        productResponse.setFlavours(flavourMap);

        return productResponse;
    }
}