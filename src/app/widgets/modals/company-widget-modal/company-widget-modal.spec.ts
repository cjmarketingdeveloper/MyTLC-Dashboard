import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyWidgetModal } from './company-widget-modal';

describe('CompanyWidgetModal', () => {
  let component: CompanyWidgetModal;
  let fixture: ComponentFixture<CompanyWidgetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyWidgetModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyWidgetModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
