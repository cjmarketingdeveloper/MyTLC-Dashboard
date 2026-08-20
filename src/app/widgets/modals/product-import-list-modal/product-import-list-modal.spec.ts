import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImportListModal } from './product-import-list-modal';

describe('ProductImportListModal', () => {
  let component: ProductImportListModal;
  let fixture: ComponentFixture<ProductImportListModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductImportListModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductImportListModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
