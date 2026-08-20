import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pharmacies } from './pharmacies';

describe('Pharmacies', () => {
  let component: Pharmacies;
  let fixture: ComponentFixture<Pharmacies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pharmacies],
    }).compileComponents();

    fixture = TestBed.createComponent(Pharmacies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
