import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { qs } from '../interfaces/IcontentResponse'; 
import { ChatCompletion } from '../interfaces/IChatCompletionResponse'; // Import the missing interface
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AgenticService {

  constructor(private http: HttpClient) { } // Inject HttpClient
  getTermSummary(qs: qs ): Observable<ChatCompletion> {
    return this.http.post<ChatCompletion>(`/api/agents/completions`,{
      agent_id: "ag:b1a2545d:20250401:untitled-agent:adddfb95",
      messages: [
        {
          role: 'user',
          content: JSON.stringify(qs)
        }
      ]
    })
  }
}
