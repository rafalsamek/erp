import { TemplateEntity } from './template-entity.model';

export interface DocumentEntity {
  id: number;
  title: string;
  description?: string;
  templateId?: number;
  template?: TemplateEntity;
  createdAt?: string;
  updatedAt?: string;
  file?: File;
}
