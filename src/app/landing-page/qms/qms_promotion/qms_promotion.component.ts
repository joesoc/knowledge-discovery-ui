import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Autnresponse, IQMSPromotionResult } from 'src/app/interfaces/IQMSPromotionResult';
import { QmsService } from 'src/app/services/qms.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qms-promotion',
  standalone: true,
  templateUrl: './qms_promotion.component.html',
  styleUrl: './qms_promotion.component.css'
})
export class QmsPromotionComponent implements OnChanges {
  
  @Input() topPromotions: IQMSPromotionResult = {} as IQMSPromotionResult;  // Receive searchKeyword input from another component
  @Input() showPromotions: boolean = false;
  constructor(private _qmssvc: QmsService) {
  }

  ngOnInit(): void {
  }
  // Implement ngOnChanges to handle updates to the input property
  ngOnChanges(changes: SimpleChanges): void {
  }
}
