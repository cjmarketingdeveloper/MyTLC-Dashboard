import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariations } from './product-variations';

describe('ProductVariations', () => {
  let component: ProductVariations;
  let fixture: ComponentFixture<ProductVariations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVariations],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductVariations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
