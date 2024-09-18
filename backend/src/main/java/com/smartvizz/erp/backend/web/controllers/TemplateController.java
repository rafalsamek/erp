package com.smartvizz.erp.backend.web.controllers;

import com.smartvizz.erp.backend.services.TemplateService;
import com.smartvizz.erp.backend.web.models.TemplateRequest;
import com.smartvizz.erp.backend.web.models.TemplateResponse;
import com.smartvizz.erp.backend.web.models.PageDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = {
        "http://localhost:8889",
        "http://localhost:4200",
        "http://162.55.215.13:8899",
        "http://162.55.215.13:4200"
})
public class TemplateController {

    private final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping
    public ResponseEntity<PageDTO<TemplateResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(defaultValue = "updatedAt,title") String[] sortColumns,
            @RequestParam(defaultValue = "asc,asc") String[] sortDirections,
            @RequestParam(defaultValue = "") String searchBy,
            @AuthenticationPrincipal User user
    ) {
        PageDTO<TemplateResponse> templates = templateService.fetchAll(
                page,
                size,
                sortColumns,
                sortDirections,
                searchBy,
                user
        );


        return ResponseEntity.ok(templates);
    }

    @GetMapping("{id}")
    public ResponseEntity<TemplateResponse> get(@PathVariable Long id, @AuthenticationPrincipal User user) {
        TemplateResponse template = templateService.fetchOne(id, user);
        
        return ResponseEntity.ok(template);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<TemplateResponse> create(
            @Valid @ModelAttribute TemplateRequest request,
            @AuthenticationPrincipal User user
            ) {
        TemplateResponse createdTemplate = templateService.create(request, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTemplate);
    }

    @PutMapping(value = "{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<TemplateResponse> update(
            @PathVariable Long id,
            @Valid @ModelAttribute TemplateRequest request,
            @AuthenticationPrincipal User user
            ) {
        TemplateResponse updatedTemplate = templateService.update(id, request, user);

        return ResponseEntity.ok(updatedTemplate);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        templateService.delete(id, user);

        return ResponseEntity.noContent().build();
    }
}

