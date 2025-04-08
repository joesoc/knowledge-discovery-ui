import { TestBed } from '@angular/core/testing';

import { NifiService } from './nifi.service';

describe('NifiService', () => {
  let service: NifiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NifiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
