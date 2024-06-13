package com.project.supplement.controller;

import com.project.supplement.dto.request.productDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public void createProduct(@RequestBody productDTO productRequest){
        productService.create(productRequest);
    }

    @GetMapping("/findByCategoryId/{categoryId}")
    public List<productResponse> findProductsByCategoryId(@PathVariable Long categoryId){
        return productService.findByCategoryId(categoryId);
    }

    @GetMapping("/allNames")
    public List<String> getAllProductsName(){
        return productService.getAllNames();
    }

    @GetMapping("/findByPathName/{pathName}")
    public productResponse findProductByPathName(@PathVariable String pathName){
        return productService.findProductByPathName(pathName);
    }

    @DeleteMapping("/{productId}")
    public void deleteProductById(@PathVariable Long productId){
        productService.delete(productId);
    }

    @GetMapping("/{productId}")
    public productResponse findProductById(@PathVariable Long productId){
        return productService.findById(productId);
    }

    @GetMapping("/findByInput/{input}")
    public List<productResponse> findProductByInput(@PathVariable String input){
        return productService.findByInput(input);
    }
}
