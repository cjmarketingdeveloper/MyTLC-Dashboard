import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySingle } from './pharmacy-single';

describe('PharmacySingle', () => {
  let component: PharmacySingle;
  let fixture: ComponentFixture<PharmacySingle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacySingle],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacySingle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
