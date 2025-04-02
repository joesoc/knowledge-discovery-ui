import { TestBed } from '@angular/core/testing';

import { AgenticService } from './agentic.service';

describe('AgenticService', () => {
  let service: AgenticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgenticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
