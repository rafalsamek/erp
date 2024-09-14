package com.smartvizz.erp.backend.web.controllers;

import com.smartvizz.erp.backend.services.CategoryService;
import com.smartvizz.erp.backend.web.models.CategoryRequest;
import com.smartvizz.erp.backend.web.models.CategoryResponse;
import com.smartvizz.erp.backend.web.models.PageDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {
        "http://localhost:8889",
        "http://localhost:4200",
        "http://162.55.215.13:8889",
        "http://162.55.215.13:4200"
})
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<PageDTO<CategoryResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(defaultValue = "id") String[] sortColumns,
            @RequestParam(defaultValue = "asc") String[] sortDirections,
            @RequestParam(defaultValue = "") String searchBy,
            @AuthenticationPrincipal User user
    ) {
        PageDTO<CategoryResponse> categories = categoryService.fetchAll(
                page,
                size,
                sortColumns,
                sortDirections,
                searchBy,
                user
        );

        return ResponseEntity.ok(categories);
    }

    @GetMapping("{id}")
    public ResponseEntity<CategoryResponse> get(@PathVariable Long id, @AuthenticationPrincipal User user) {
        CategoryResponse category = categoryService.fetchOne(id, user);

        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(
            @Valid @RequestBody CategoryRequest request,
            @AuthenticationPrincipal User user
            ) {
        CategoryResponse createdCategory = categoryService.create(request, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @PutMapping("{id}")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            @AuthenticationPrincipal User user
            ) {
        CategoryResponse updatedCategory = categoryService.update(id, request, user);

        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        categoryService.delete(id, user);
        
        return ResponseEntity.noContent().build();
    }
}

