import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsCountComponent } from './results-count.component';

describe('ResultsCountComponent', () => {
  let component: ResultsCountComponent;
  let fixture: ComponentFixture<ResultsCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsCountComponent]
    });
    fixture = TestBed.createComponent(ResultsCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
