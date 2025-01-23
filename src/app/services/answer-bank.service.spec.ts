import { TestBed } from '@angular/core/testing';

import { AnswerBankService } from './answer-bank.service';

describe('AnswerBankService', () => {
  let service: AnswerBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnswerBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
