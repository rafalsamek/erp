import { TemplateEntity } from './template-entity.model';
import { CategoryEntity } from './category-entity.model';

export interface DocumentEntity {
  id: number;
  title: string;
  description?: string;
  templateId?: number;
  template?: TemplateEntity;
  categoryIds?: number[];
  categories?: CategoryEntity[];
  createdAt?: string;
  updatedAt?: string;
  file?: File;
}
