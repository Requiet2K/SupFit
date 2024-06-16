package com.project.supplement.controller;

import com.project.supplement.entity.Category;
import com.project.supplement.exception.custom_exceptions.InvalidIdException;
import com.project.supplement.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping("/{categoryName}")
    public ResponseEntity<Long> findCategoryIdByName(@PathVariable String categoryName) {
        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new InvalidIdException("Invalid category!"));
        return ResponseEntity.ok(category.getId());
    }

    @GetMapping
    public ResponseEntity<List<Category>> findAll() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }
}
