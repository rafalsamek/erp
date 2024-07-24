import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudPaginationComponent } from './crud-pagination.component';

describe('PaginationComponent', () => {
  let component: CrudPaginationComponent;
  let fixture: ComponentFixture<CrudPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudPaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
