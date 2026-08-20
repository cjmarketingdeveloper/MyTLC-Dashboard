import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesWidgetModal } from './categories-widget-modal';

describe('CategoriesWidgetModal', () => {
  let component: CategoriesWidgetModal;
  let fixture: ComponentFixture<CategoriesWidgetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesWidgetModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesWidgetModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
