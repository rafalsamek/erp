package com.smartvizz.erp.backend.data.specifications;

import com.smartvizz.erp.backend.data.entities.TemplateEntity;
import com.smartvizz.erp.backend.data.entities.CategoryEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TemplateSpecifications {

    private TemplateSpecifications() {
    }

    public static Specification<TemplateEntity> searchTemplate(String searchBy) {
        return (root, query, builder) -> {
            if (searchBy == null || searchBy.isEmpty()) {
                return builder.conjunction();
            }

            List<Predicate> predicateList = new ArrayList<>();

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

            Join<TemplateEntity, CategoryEntity> categoryJoin = root.join("categories");
            predicateList.add(
                    builder.like(builder.lower(categoryJoin.get("name")), "%" + searchBy.toLowerCase() + "%")
            );
            predicateList.add(
                    builder.like(builder.lower(categoryJoin.get("description")), "%" + searchBy.toLowerCase() + "%")
            );

            return builder.or(predicateList.toArray(new Predicate[]{}));
        };
    }
}
