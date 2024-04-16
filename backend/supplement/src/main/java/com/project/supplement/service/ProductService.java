package com.project.supplement.service;

import com.project.supplement.dto.productDTO;

import java.util.List;

public interface ProductService {
    void createProduct(productDTO productRequest);
    public List<productDTO> getProductsByCategory(Long categoryId);
}
