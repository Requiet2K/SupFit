package com.project.supplement.controller;

import com.project.supplement.dto.request.productDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<Void> createProduct(@RequestBody productDTO productRequest) {
        productService.create(productRequest);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/findByCategoryId/{categoryId}")
    public ResponseEntity<List<productResponse>> findProductsByCategoryId(@PathVariable Long categoryId) {
        List<productResponse> products = productService.findByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/allNames")
    public ResponseEntity<List<String>> getAllProductsName() {
        List<String> names = productService.getAllNames();
        return ResponseEntity.ok(names);
    }

    @GetMapping("/findByPathName/{pathName}")
    public ResponseEntity<productResponse> findProductByPathName(@PathVariable String pathName) {
        productResponse product = productService.findProductByPathName(pathName);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProductById(@PathVariable Long productId) {
        productService.delete(productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{productId}")
    public ResponseEntity<productResponse> findProductById(@PathVariable Long productId) {
        productResponse product = productService.findById(productId);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/findByInput/{input}")
    public ResponseEntity<List<productResponse>> findProductByInput(@PathVariable String input) {
        List<productResponse> products = productService.findByInput(input);
        return ResponseEntity.ok(products);
    }
}
