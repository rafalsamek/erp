import { TemplateEntity } from './template-entity.model';

describe('TemplateEntity', () => {
  it('should create an instance', () => {
    const template: TemplateEntity = {
      id: 1,
      title: 'Sample Template',
      description: 'This is a sample template description',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(template).toBeTruthy();
  });
});
