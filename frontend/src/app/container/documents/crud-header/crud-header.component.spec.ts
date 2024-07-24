import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudHeaderComponent } from './crud-header.component';

describe('CrudHeaderComponent', () => {
  let component: CrudHeaderComponent;
  let fixture: ComponentFixture<CrudHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
