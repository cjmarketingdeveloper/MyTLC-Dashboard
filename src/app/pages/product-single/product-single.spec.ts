import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSingle } from './product-single';

describe('ProductSingle', () => {
  let component: ProductSingle;
  let fixture: ComponentFixture<ProductSingle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSingle],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSingle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
