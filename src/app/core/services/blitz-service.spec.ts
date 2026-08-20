import { TestBed } from '@angular/core/testing';

import { BlitzService } from './blitz-service';

describe('BlitzService', () => {
  let service: BlitzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlitzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
