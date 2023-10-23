import { Component } from '@angular/core';
import { QmsService } from '../services/qms.service';
import { IQMSModelEncodeResponse } from '../interfaces/Iqmsmodel';
import { IResultSummary } from '../interfaces/IsearchResultsSummary';
import { ISearchResultItem } from '../interfaces/IsearchResultItem';
import { Hit } from '../interfaces/IcontentResponse';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent {
  searchkeyword: string = "";
  constructor(private svcQms:QmsService){}
  resultsSummary: IResultSummary = {} as IResultSummary;
  resultItems: ISearchResultItem[] = [];
  idolresultsItems: ISearchResultItem[] = [];
  idolresultsSummary: IResultSummary = {} as IResultSummary;
  selectedDatabase: string[] = [];
  propogateDatabaseSelection(valueEmitted:any){
    this.selectedDatabase = [];
    valueEmitted.forEach((database: string) => {
      this.selectedDatabase.push(database);
    });
  }
  getDatabaseSelection(){
    return this.selectedDatabase.join(',');
  }
  propogateSearchTerm(valueEmitted:any){
    this.resultsSummary = {} as IResultSummary;
    this.resultItems = [];
    this.idolresultsItems = [];
    this.idolresultsSummary = {} as IResultSummary;
    this.searchkeyword  = valueEmitted;
    this.svcQms.encodeQMS(this.searchkeyword).subscribe((data:IQMSModelEncodeResponse)=>{
      let autnresponse = data.autnresponse;
      let responsedata = autnresponse.responsedata;
      let embeddings = responsedata.embeddings;
      let num_vectors = parseInt(embeddings.num_vectors);
      let vector = embeddings.vector[0];

      this.svcQms.getResults(this.searchkeyword, this.getDatabaseSelection()).subscribe((data)=>{
        this.idolresultsSummary.numhits = parseInt(data.autnresponse.responsedata.numhits);
        this.idolresultsSummary.predicted = data.autnresponse.responsedata.predicted;
        this.idolresultsSummary.totaldbdocs = parseInt(data.autnresponse.responsedata.totaldbdocs);
        this.idolresultsSummary.totaldbsecs = parseInt(data.autnresponse.responsedata.totaldbsecs);
        this.idolresultsSummary.totalhits = parseInt(data.autnresponse.responsedata.totalhits);
        data.autnresponse.responsedata.hit.forEach((hit: Hit)=>{
          this.idolresultsItems.push({
            title: hit.title,
            reference: hit.reference,
            summary: hit.summary,
            autnrank: hit.weight // Add the autnrank property here
          });
        });
      });
      this.svcQms.getVectorResults(vector, this.getDatabaseSelection()).subscribe((data)=>{
        this.resultsSummary.numhits = parseInt(data.autnresponse.responsedata.numhits);
        this.resultsSummary.predicted = data.autnresponse.responsedata.predicted;
        this.resultsSummary.totaldbdocs = parseInt(data.autnresponse.responsedata.totaldbdocs);
        this.resultsSummary.totaldbsecs = parseInt(data.autnresponse.responsedata.totaldbsecs);
        this.resultsSummary.totalhits = parseInt(data.autnresponse.responsedata.totalhits);
        data.autnresponse.responsedata.hit.forEach((hit: Hit)=>{
          this.resultItems.push({
            title: hit.title,
            reference: hit.reference,
            summary: hit.summary,
            autnrank: hit.weight // Add the autnrank property here
          });
        });
      });
  }
    );
    
  }
}
