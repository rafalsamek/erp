import { CategoryEntity } from './category-entity.model';

describe('CategoryEntity', () => {
  it('should create an instance', () => {
    const category: CategoryEntity = {
      id: 1,
      name: 'Sample Category',
      description: 'This is a sample category description',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(category).toBeTruthy();
  });
});
