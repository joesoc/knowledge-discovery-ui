import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LlmService {
    private readonly http = inject(HttpClient);

    
    async verifyInput(input: string): Promise<boolean> {

    const data = {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        prompt: `Your task is to perform binary classification on the text which appears between << >> into one of the following categories: question or other

The answer must only contain question or other. Remove any new line characters from the answer.
###
Here are some examples:
Text: What is my name
question
Text: hello
other
Text: Mary had a little lamb
other
Text: *
other
###
<<${input}>>`,
        max_tokens: 2,
        n: 1
    };


        const response = await this.http.post<MistralCompletionResponse>(`${environment.mistral_api}`, data).toPromise();
        return response?.choices[0].text.trim() === 'question';
    }
}

export interface MistralCompletionResponse {
    id: string
    object: string
    created: number
    model: string
    choices: Choice[]
    usage: Usage
  }
  
  export interface Choice {
    index: number
    text: string
    logprobs: any
    finish_reason: string
  }
  
  export interface Usage {
    prompt_tokens: number
    total_tokens: number
    completion_tokens: number
  }
  