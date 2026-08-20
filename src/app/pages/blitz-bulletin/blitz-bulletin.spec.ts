import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlitzBulletin } from './blitz-bulletin';

describe('BlitzBulletin', () => {
  let component: BlitzBulletin;
  let fixture: ComponentFixture<BlitzBulletin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlitzBulletin],
    }).compileComponents();

    fixture = TestBed.createComponent(BlitzBulletin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
