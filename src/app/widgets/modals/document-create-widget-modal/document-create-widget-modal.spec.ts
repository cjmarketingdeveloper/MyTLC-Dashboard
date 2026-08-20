import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCreateWidgetModal } from './document-create-widget-modal';

describe('DocumentCreateWidgetModal', () => {
  let component: DocumentCreateWidgetModal;
  let fixture: ComponentFixture<DocumentCreateWidgetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentCreateWidgetModal],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentCreateWidgetModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
