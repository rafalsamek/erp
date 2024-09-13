package com.smartvizz.erp.backend.data.specifications;

import com.smartvizz.erp.backend.data.entities.DocumentEntity;
import com.smartvizz.erp.backend.data.entities.CategoryEntity; // Ensure the import
import com.smartvizz.erp.backend.data.entities.UserEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class DocumentSpecifications {

    private DocumentSpecifications() {
    }

    public static Specification<DocumentEntity> searchDocument(String searchBy) {
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

            Join<?, ?> templateJoin = root.join("template");
            predicateList.add(
                    builder.like(builder.lower(templateJoin.get("title")), "%" + searchBy.toLowerCase() + "%")
            );
            predicateList.add(
                    builder.like(builder.lower(templateJoin.get("description")), "%" + searchBy.toLowerCase() + "%")
            );

            Join<DocumentEntity, CategoryEntity> categoryJoin = root.join("categories");
            predicateList.add(
                    builder.like(builder.lower(categoryJoin.get("name")), "%" + searchBy.toLowerCase() + "%")
            );
            predicateList.add(
                    builder.like(builder.lower(categoryJoin.get("description")), "%" + searchBy.toLowerCase() + "%")
            );

            return builder.or(predicateList.toArray(new Predicate[0]));
        };
    }
    public static Specification<DocumentEntity> byUser(UserEntity userEntity) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("user"), userEntity);
    }

}
