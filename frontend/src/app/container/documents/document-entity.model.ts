export interface DocumentEntity {
  id: number;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  file?: File;
}
