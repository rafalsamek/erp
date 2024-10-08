package com.smartvizz.erp.backend.data.specifications;

import com.smartvizz.erp.backend.data.entities.CategoryEntity;
import com.smartvizz.erp.backend.data.entities.DocumentEntity;
import com.smartvizz.erp.backend.data.entities.TemplateEntity;
import com.smartvizz.erp.backend.data.entities.UserEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CategorySpecifications {

    private CategorySpecifications() {
    }

    public static Specification<CategoryEntity> searchCategory(String searchBy) {
        return (root, query, builder) -> {
            if (searchBy == null || searchBy.isEmpty()) {
                return builder.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(
                    builder.like(builder.lower(root.get("name")), "%" + searchBy.toLowerCase() + "%")
            );
            predicates.add(
                    builder.like(builder.lower(root.get("description")), "%" + searchBy.toLowerCase() + "%")
            );

            Join<CategoryEntity, DocumentEntity> documentJoin = root.join("documents");
            predicates.add(
                    builder.like(builder.lower(documentJoin.get("title")), "%" + searchBy.toLowerCase() + "%")
            );
            predicates.add(
                    builder.like(builder.lower(documentJoin.get("description")), "%" + searchBy.toLowerCase() + "%")
            );

            Join<CategoryEntity, TemplateEntity> templateJoin = root.join("templates");
            predicates.add(
                    builder.like(builder.lower(templateJoin.get("title")), "%" + searchBy.toLowerCase() + "%")
            );
            predicates.add(
                    builder.like(builder.lower(templateJoin.get("description")), "%" + searchBy.toLowerCase() + "%")
            );

            return builder.or(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<CategoryEntity> byUser(UserEntity userEntity) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("user"), userEntity);
    }
}
