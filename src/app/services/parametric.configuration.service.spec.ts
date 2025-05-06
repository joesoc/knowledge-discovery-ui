import { TestBed } from '@angular/core/testing';

import { ParametricConfigurationService } from './parametric.configuration.service';

describe('ParametricConfigurationService', () => {
  let service: ParametricConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametricConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
