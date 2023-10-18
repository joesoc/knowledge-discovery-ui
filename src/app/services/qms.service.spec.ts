import { TestBed } from '@angular/core/testing';

import { QmsService } from './qms.service';

describe('QmsService', () => {
  let service: QmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
