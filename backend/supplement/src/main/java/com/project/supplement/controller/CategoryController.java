package com.project.supplement.controller;

import com.project.supplement.entity.Category;
import com.project.supplement.exception.custom_exceptions.InvalidCategoryIdException;
import com.project.supplement.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping("/findCategoryIdByName/{categoryName}")
    public Long findCategoryIdByName(@PathVariable String categoryName){
        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(InvalidCategoryIdException::new);
        return category.getId();
    }
}