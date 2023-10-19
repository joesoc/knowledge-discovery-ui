import { Component } from '@angular/core';
import { QmsService } from '../services/qms.service';
import { IQMSModelEncodeResponse } from '../interfaces/Iqmsmodel';
import { IResultSummary } from '../interfaces/IsearchResultsSummary';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent {
  searchkeyword: string = "";
  constructor(private svcQms:QmsService){}
  resultsSummary: IResultSummary = {} as IResultSummary;
  propogateSearchTerm(valueEmitted:any){
    this.searchkeyword  = valueEmitted;
    this.svcQms.encodeQMS(this.searchkeyword).subscribe((data:IQMSModelEncodeResponse)=>{
      let autnresponse = data.autnresponse;
      let responsedata = autnresponse.responsedata;
      let embeddings = responsedata.embeddings;
      let num_vectors = parseInt(embeddings.num_vectors);
      let vector = embeddings.vector[0];
      this.svcQms.getVectorResults(vector).subscribe((data)=>{
        this.resultsSummary.numhits = parseInt(data.autnresponse.responsedata.numhits);
        this.resultsSummary.predicted = data.autnresponse.responsedata.predicted;
        this.resultsSummary.totaldbdocs = parseInt(data.autnresponse.responsedata.totaldbdocs);
        this.resultsSummary.totaldbsecs = parseInt(data.autnresponse.responsedata.totaldbsecs);
        this.resultsSummary.totalhits = parseInt(data.autnresponse.responsedata.totalhits);
      });
    });
  }
}
