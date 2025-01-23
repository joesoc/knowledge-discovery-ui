import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleAlsoAskedComponent } from './people-also-asked.component';

describe('PeopleAlsoAskedComponent', () => {
  let component: PeopleAlsoAskedComponent;
  let fixture: ComponentFixture<PeopleAlsoAskedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleAlsoAskedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleAlsoAskedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
