import { DocumentEntity } from './document-entity.model';

describe('DocumentEntity', () => {
  it('should create an instance', () => {
    const document: DocumentEntity = {
      id: 1,
      title: 'Sample Document',
      description: 'This is a sample document description',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    expect(document).toBeTruthy();
  });
});
