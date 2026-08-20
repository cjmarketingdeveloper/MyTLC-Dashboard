import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSingle } from './order-single';

describe('OrderSingle', () => {
  let component: OrderSingle;
  let fixture: ComponentFixture<OrderSingle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSingle],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSingle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
