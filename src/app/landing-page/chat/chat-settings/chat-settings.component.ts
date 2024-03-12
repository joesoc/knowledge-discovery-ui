import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Data } from '@angular/router';
import { System } from 'src/app/interfaces/IAnswerServerGetStatusResponse';
import { Database } from 'src/app/interfaces/IDahResponse';
import { AnswerService } from 'src/app/services/answer.service';
import { DahService } from 'src/app/services/dah.service';
import { DataService } from 'src/app/services/data.service';
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
              private dataService: DataService) { 

    // populate the databases and answer systems
    this.databases = JSON.parse(localStorage.getItem('databases') ?? "[]");
    this.answerSystems = JSON.parse(localStorage.getItem('answerSystems') ?? "[]");

    this.dahService.getDatabases().subscribe((dbs: Database[]) => {
      this.databases = dbs;
      // cache the databases in local storage
      localStorage.setItem('databases', JSON.stringify(this.databases));
    }, (err) => {
      console.log(err);
    });
    this.answerService.getAnswerSystems().subscribe((systems: System[]) => { 
      this.answerSystems = systems.filter((system) => system.type !== "conversation");
      // cache the answer systems in local storage
      localStorage.setItem('answerSystems', JSON.stringify(this.answerSystems));
    });

  }
   ngOnInit() {
      this.loadSettings();
    }

  saveSettings(): void {
    localStorage.setItem('selectedDatabase', this.selectedDatabase);
    localStorage.setItem('selectedAnswerSystem', this.selectedAnswerSystem);
    this.dataService.addDataToRedis(this.sessionID, this.selectedDatabase, this.selectedAnswerSystem);
    this.closeChatSettings.emit(false);
  }
  loadSettings(): void {
      this.selectedDatabase = localStorage.getItem('selectedDatabase') ?? "";
      this.selectedAnswerSystem = localStorage.getItem('selectedAnswerSystem') ?? "";
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
