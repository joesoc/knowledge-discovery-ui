import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent {
  keyword: string = "";
  propogateSearchTerm(valueEmitted:any){
    this.keyword  = valueEmitted;
    console.log("Search Term is : ", this.keyword);
    console.log("Message from Landing Page Component")
  }
}
