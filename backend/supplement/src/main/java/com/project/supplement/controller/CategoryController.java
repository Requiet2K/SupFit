package com.project.supplement.controller;

import com.project.supplement.entity.Category;
import com.project.supplement.exception.custom_exceptions.InvalidIdException;
import com.project.supplement.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping("/{categoryName}")
    public Long findCategoryIdByName(@PathVariable String categoryName){
        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new InvalidIdException("Invalid category!"));
        return category.getId();
    }

    @GetMapping
    public List<Category> findAll(){
        return categoryRepository.findAll();
    }
}
