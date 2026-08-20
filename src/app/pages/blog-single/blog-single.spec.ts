import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSingle } from './blog-single';

describe('BlogSingle', () => {
  let component: BlogSingle;
  let fixture: ComponentFixture<BlogSingle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogSingle],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogSingle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
