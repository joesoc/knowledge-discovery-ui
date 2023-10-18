import { Component } from '@angular/core';
import { QmsService } from '../services/qms.service';
import { IQMSModelEncodeResponse } from '../interfaces/Iqmsmodel';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent {
  keyword: string = "";
  constructor(private svcQms:QmsService){}

  propogateSearchTerm(valueEmitted:any){
    this.keyword  = valueEmitted;
    this.svcQms.encodeQMS(this.keyword).subscribe((data:IQMSModelEncodeResponse)=>{
      console.log(data);
    });
  }
}
