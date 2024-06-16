package com.project.supplement.service;

import com.project.supplement.dto.request.productDTO;
import com.project.supplement.dto.response.productResponse;

import java.util.List;

public interface ProductService {
    void create(productDTO productRequest);
    List<productResponse> findByCategoryId(Long categoryId);
    void delete(Long productId);
    List<String> getAllNames();
    productResponse findProductByPathName(String pathName);
    productResponse findById(Long productId);
    List<productResponse> findByInput(String input);
    void reStock();
}
