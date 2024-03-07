import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerpaneComponent } from './answerpane.component';

describe('AnswerpaneComponent', () => {
  let component: AnswerpaneComponent;
  let fixture: ComponentFixture<AnswerpaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AnswerpaneComponent]
});
    fixture = TestBed.createComponent(AnswerpaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
