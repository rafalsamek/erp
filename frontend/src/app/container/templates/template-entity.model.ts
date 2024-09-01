import { CategoryEntity } from './category-entity.model';

export interface TemplateEntity {
  id: number;
  title: string;
  description?: string;
  categoryIds?: number[];
  categories?: CategoryEntity[];
  createdAt?: string;
  updatedAt?: string;
  file?: File;
}
