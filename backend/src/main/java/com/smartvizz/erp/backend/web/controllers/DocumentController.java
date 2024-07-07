package com.smartvizz.erp.backend.web.controllers;

import com.smartvizz.erp.backend.services.DocumentService;
import com.smartvizz.erp.backend.web.models.DocumentRequest;
import com.smartvizz.erp.backend.web.models.DocumentResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> list() {
        List<DocumentResponse> categories = documentService.fetchAll();

        return ResponseEntity.ok(categories);
    }

    @GetMapping("{id}")
    public ResponseEntity<DocumentResponse> get(@PathVariable Long id) {
        DocumentResponse document = documentService.fetchOne(id);

        return ResponseEntity.ok(document);
    }

    @PostMapping
    public ResponseEntity<DocumentResponse> create(@RequestBody DocumentRequest request) {
        DocumentResponse createdDocument = documentService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdDocument);
    }

    @PutMapping("{id}")
    public ResponseEntity<DocumentResponse> update(@PathVariable Long id, @RequestBody DocumentRequest request) {
        DocumentResponse updatedDocument = documentService.update(id, request);

        return ResponseEntity.ok(updatedDocument);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.delete(id);

        return ResponseEntity.noContent().build();
    }
}

