import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlitzBulletinCreate } from './blitz-bulletin-create';

describe('BlitzBulletinCreate', () => {
  let component: BlitzBulletinCreate;
  let fixture: ComponentFixture<BlitzBulletinCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlitzBulletinCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(BlitzBulletinCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
