import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsScreen } from './settings-screen';

describe('SettingsScreen', () => {
  let component: SettingsScreen;
  let fixture: ComponentFixture<SettingsScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
