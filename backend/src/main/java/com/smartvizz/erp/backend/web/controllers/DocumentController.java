package com.smartvizz.erp.backend.web.controllers;

import com.smartvizz.erp.backend.services.DocumentService;
import com.smartvizz.erp.backend.web.models.DocumentRequest;
import com.smartvizz.erp.backend.web.models.DocumentResponse;
import com.smartvizz.erp.backend.web.models.PageDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = {
        "https://erp.smartvizz.com"
})
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<PageDTO<DocumentResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(defaultValue = "updatedAt,title") String[] sortColumns,
            @RequestParam(defaultValue = "asc,asc") String[] sortDirections,
            @RequestParam(defaultValue = "") String searchBy,
            @AuthenticationPrincipal User user
    ) {
        PageDTO<DocumentResponse> documents = documentService.fetchAll(
                page,
                size,
                sortColumns,
                sortDirections,
                searchBy,
                user
        );


        return ResponseEntity.ok(documents);
    }

    @GetMapping("{id}")
    public ResponseEntity<DocumentResponse> get(@PathVariable Long id, @AuthenticationPrincipal User user) {
        DocumentResponse document = documentService.fetchOne(id, user);

        return ResponseEntity.ok(document);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<DocumentResponse> create(
            @Valid @ModelAttribute DocumentRequest request,
            @AuthenticationPrincipal User user
    ) {
        DocumentResponse createdDocument = documentService.create(request, user);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDocument);
    }

    @PutMapping(value = "{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<DocumentResponse> update(
            @PathVariable Long id,
            @Valid @ModelAttribute DocumentRequest request,
            @AuthenticationPrincipal User user
            ) {
        DocumentResponse updatedDocument = documentService.update(id, request, user);
        
        return ResponseEntity.ok(updatedDocument);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        documentService.delete(id, user);
        
        return ResponseEntity.noContent().build();
    }
}

