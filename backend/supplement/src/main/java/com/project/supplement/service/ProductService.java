package com.project.supplement.service;

import com.project.supplement.dto.request.productDTO;
import com.project.supplement.dto.response.productResponse;

import java.util.List;

public interface ProductService {
    void createProduct(productDTO productRequest);
    List<productResponse> getProductsByCategory(Long categoryId);
    void deleteProduct(Long productId);
    List<String> getAllProductsName();
    productResponse findProductByPathName(String pathName);
    productResponse getProductById(Long productId);
}
