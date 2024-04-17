package com.project.supplement.service.impl;

import com.project.supplement.dto.productDTO;
import com.project.supplement.entity.Address;
import com.project.supplement.entity.Category;
import com.project.supplement.entity.NutritionFacts;
import com.project.supplement.entity.Product;
import com.project.supplement.exception.custom_exceptions.AddressNotExistsException;
import com.project.supplement.exception.custom_exceptions.InvalidCategoryIdException;
import com.project.supplement.exception.custom_exceptions.ProductNotExistsException;
import com.project.supplement.repository.CategoryRepository;
import com.project.supplement.repository.ProductRepository;
import com.project.supplement.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public ProductServiceImpl(ProductRepository productRepository, ModelMapper modelMapper, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public void createProduct(productDTO productRequest) {

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

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(InvalidCategoryIdException::new);
        product.setCategory(category);

        productRepository.save(product);
    }

    public List<productDTO> getProductsByCategory(Long categoryId){
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(InvalidCategoryIdException::new);
        List<Product> products = productRepository.findAllByCategoryId(categoryId);

        return products.stream()
                .map(product -> {
                    productDTO productDto = modelMapper.map(product, productDTO.class);
                    productDto.setNutritionFacts(product.getNutritionFacts().stream()
                            .collect(Collectors.toMap(NutritionFacts::getNutrientName, NutritionFacts::getAmount)));
                    productDto.setCategoryId(product.getCategory().getId());
                    return productDto;
                })
                .collect(Collectors.toList());
    }

    public void deleteProduct(Long productId){
        Optional<Product> product = productRepository.findById(productId);
        product.ifPresentOrElse(productRepository::delete,
                ProductNotExistsException::new
        );
    }
}
