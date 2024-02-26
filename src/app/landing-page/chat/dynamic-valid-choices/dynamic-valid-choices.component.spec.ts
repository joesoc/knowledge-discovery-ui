import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicValidChoicesComponent } from './dynamic-valid-choices.component';

describe('DynamicValidChoicesComponent', () => {
  let component: DynamicValidChoicesComponent;
  let fixture: ComponentFixture<DynamicValidChoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicValidChoicesComponent]
    });
    fixture = TestBed.createComponent(DynamicValidChoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
