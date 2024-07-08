package com.smartvizz.erp.backend.data.specifications;

import com.smartvizz.erp.backend.data.entities.DocumentEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class DocumentSpecifications {

    private DocumentSpecifications() {
    }

    public static Specification<DocumentEntity> searchDocument(String searchBy) {
        return (root, query, builder) -> {
            List<Predicate> predicateList = new ArrayList<>();

            if (searchBy != null) {
                predicateList.add(
                        builder.equal(builder.toString(root.get("id")), searchBy)
                );
                predicateList.add(
                        builder.like(builder.lower(root.get("title")), "%" + searchBy.toLowerCase() + "%")
                );
                predicateList.add(
                        builder.like(builder.lower(root.get("description")), "%" + searchBy.toLowerCase() + "%")
                );
                predicateList.add(
                        builder.like(builder.toString(root.get("createdAt")), "%" + searchBy + "%")
                );
                predicateList.add(
                        builder.like(builder.toString(root.get("updatedAt")), "%" + searchBy + "%")
                );
            }

            return builder.or(predicateList.toArray(new Predicate[]{}));
        };
    }

}
