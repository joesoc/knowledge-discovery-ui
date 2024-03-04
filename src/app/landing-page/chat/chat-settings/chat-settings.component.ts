import { Component, EventEmitter, Output } from '@angular/core';
import { Data } from '@angular/router';
import { System } from 'src/app/interfaces/IAnswerServerGetStatusResponse';
import { Database } from 'src/app/interfaces/IDahResponse';
import { AnswerService } from 'src/app/services/answer.service';
import { DahService } from 'src/app/services/dah.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';

@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrls: ['./chat-settings.component.css']
})
export class ChatSettingsComponent {
  databases: Database[] = [];
  answerSystems: System[] = [];
  loadingDatabase = true;
  selectedDatabase: string ="";
  selectedAnswerSystem: string = "";
  
  constructor(private dahService: DahService, 
              private answerService: AnswerService,
              private indexDBService: IndexedDbService) { 
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
  @Output() closeChatSettings = new EventEmitter<boolean>();
}
