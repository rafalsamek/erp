package com.smartvizz.erp.backend.services;

import com.smartvizz.erp.backend.data.entities.TemplateEntity;
import com.smartvizz.erp.backend.data.repositories.TemplateRepository;
import com.smartvizz.erp.backend.data.specifications.TemplateSpecifications;
import com.smartvizz.erp.backend.web.models.TemplateRequest;
import com.smartvizz.erp.backend.web.models.TemplateResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;

@Service
public class TemplateService {
    private final TemplateRepository templateRepository;
    private static final Logger logger = LoggerFactory.getLogger(TemplateService.class);

    public TemplateService(TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public Page<TemplateResponse> fetchAll(
            int page,
            int size,
            String[] sortColumns,
            String[] sortDirections,
            String searchBy
    ) {
        logger.debug("sortColumns: " + Arrays.toString(sortColumns) + ", sortDirections: " + Arrays.toString(sortDirections));
        ArrayList<Sort.Order> sortOrders = new ArrayList<>();

        for (int i = 0; i < sortColumns.length; i++) {

            String sortColumn = sortColumns[i];
            Sort.Direction sortDirection =
                    sortDirections.length > i && sortDirections[i].equalsIgnoreCase("desc")
                            ? Sort.Direction.DESC
                            : Sort.Direction.ASC;


            sortOrders.add(new Sort.Order(sortDirection, sortColumn));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortOrders));

        return templateRepository.findAll(TemplateSpecifications.searchTemplate(searchBy), pageable)
                .map(TemplateResponse::new);
    }

    public TemplateResponse fetchOne(Long id) {
             return templateRepository.findById(id)
                     .map(TemplateResponse::new)
                     .orElseThrow(NotFoundException::new);
         }


    public TemplateResponse create(TemplateRequest request) {
        TemplateEntity templateEntity = new TemplateEntity(request.title(), request.description());
        TemplateEntity savedTemplate = templateRepository.save(templateEntity);

        return new TemplateResponse(savedTemplate);
    }

    public TemplateResponse update(Long id, TemplateRequest request) {
        TemplateEntity templateEntity = templateRepository.getReferenceById(id);
        templateEntity.setTitle(request.title());
        templateEntity.setDescription(request.description());

        TemplateEntity updatedTemplate = templateRepository.save(templateEntity);

        return new TemplateResponse(updatedTemplate);
    }


    public void delete(Long id) {
        templateRepository.deleteById(id);
    }
}
