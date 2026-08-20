import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlitzBulletinSingle } from './blitz-bulletin-single';

describe('BlitzBulletinSingle', () => {
  let component: BlitzBulletinSingle;
  let fixture: ComponentFixture<BlitzBulletinSingle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlitzBulletinSingle],
    }).compileComponents();

    fixture = TestBed.createComponent(BlitzBulletinSingle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
