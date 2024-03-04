import { TestBed } from '@angular/core/testing';

import { DahService } from './dah.service';

describe('DahService', () => {
  let service: DahService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DahService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
