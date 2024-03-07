import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Data } from '@angular/router';
import { System } from 'src/app/interfaces/IAnswerServerGetStatusResponse';
import { Database } from 'src/app/interfaces/IDahResponse';
import { AnswerService } from 'src/app/services/answer.service';
import { DahService } from 'src/app/services/dah.service';
import { DataService } from 'src/app/services/data.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-chat-settings',
    templateUrl: './chat-settings.component.html',
    styleUrls: ['./chat-settings.component.css'],
    standalone: true,
    imports: [FormsModule, NgFor]
})
export class ChatSettingsComponent {
  databases: Database[] = [];
  answerSystems: System[] = [];
  loadingDatabase = true;
  selectedDatabase: string ="";
  selectedAnswerSystem: string = "";
  
  constructor(private dahService: DahService, 
              private answerService: AnswerService,
              private indexDBService: IndexedDbService,
              private dataService: DataService) { 
    this.dahService.getDatabases().subscribe((dbs: Database[]) => {
      this.databases = dbs;
    }, (err) => {
      console.log(err);
    });
    this.answerService.getAnswerSystems().subscribe((systems: System[]) => { 
      this.answerSystems = systems.filter((system) => system.type !== "conversation");
    });

  }
   ngOnInit() {
    this.indexDBService.InitIndexDB().then(() => {
      this.loadSettings();
      }
    );}

  saveSettings(): void {
    this.indexDBService.addItem({id: 'selectedDatabase', value: this.selectedDatabase});
    this.indexDBService.addItem({id: 'selectedAnswerSystem', value: this.selectedAnswerSystem});
    this.dataService.addDataToRedis(this.sessionID, this.selectedDatabase, this.selectedAnswerSystem);
    this.closeChatSettings.emit(false);
  }
  loadSettings(): void {
    this.indexDBService.getItem('selectedDatabase').then((value: any) => {
      this.selectedDatabase = value ? value.value : "";
    });
    this.indexDBService.getItem('selectedAnswerSystem').then((value: any) => {
      this.selectedAnswerSystem = value ? value.value : "";
    });
  }

  loadDatabases(): void {
    this.dahService.getDatabases().subscribe((dbs: Database[]) => {
      this.databases = dbs;
    }, (err) => {
      console.error(err);
    });
  }

  loadAnswerSystems(): void {
    this.answerService.getAnswerSystems().subscribe((systems: System[]) => { 
      this.answerSystems = systems.filter((system) => system.type !== "conversation");
    });
  }
  @Input() sessionID: string = "";
  @Output() closeChatSettings = new EventEmitter<boolean>();
}
