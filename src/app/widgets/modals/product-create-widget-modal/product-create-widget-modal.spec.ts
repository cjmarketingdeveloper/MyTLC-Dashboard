import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreateWidgetModal } from './product-create-widget-modal';

describe('ProductCreateWidgetModal', () => {
  let component: ProductCreateWidgetModal;
  let fixture: ComponentFixture<ProductCreateWidgetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreateWidgetModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCreateWidgetModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
