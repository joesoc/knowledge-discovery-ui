import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QmsPromotionComponent } from './qms_promotion.component';

describe('QmsPromotionComponent', () => {
  let component: QmsPromotionComponent;
  let fixture: ComponentFixture<QmsPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QmsPromotionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QmsPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
