package com.project.supplement.controller;

import com.project.supplement.dto.productDTO;
import com.project.supplement.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/createProduct")
    public void createAddress(@RequestBody productDTO productRequest){
        productService.createProduct(productRequest);
    }

    @GetMapping("/getProductsByCategory/{categoryId}")
    public List<productDTO> getProductsByCategoryId(@PathVariable Long categoryId){
        return productService.getProductsByCategory(categoryId);
    }

    @DeleteMapping("/deleteProductById/{productId}")
    public void deleteProductById(@PathVariable Long productId){
        productService.deleteProduct(productId);
    }
}
