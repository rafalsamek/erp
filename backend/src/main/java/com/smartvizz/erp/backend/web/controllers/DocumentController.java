package com.smartvizz.erp.backend.web.controllers;

import com.smartvizz.erp.backend.services.DocumentService;
import com.smartvizz.erp.backend.web.models.DocumentRequest;
import com.smartvizz.erp.backend.web.models.DocumentResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:8888")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<Page<DocumentResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(defaultValue = "updatedAt,title") String[] sortColumns,
            @RequestParam(defaultValue = "asc,asc") String[] sortDirections,
            @RequestParam(defaultValue = "") String searchBy
    ) {
        Page<DocumentResponse> documents = documentService.fetchAll(page, size, sortColumns, sortDirections, searchBy);

        return ResponseEntity.ok(documents);
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

