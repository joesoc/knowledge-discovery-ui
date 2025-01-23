import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LlmService {
  private readonly http = inject(HttpClient);

  async verifyInput(input: string): Promise<boolean> {
    if (input === '?') {
      return Promise.resolve(false);
    }
    const data = {
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      prompt: `You are a highly accurate text classifier trained to categorize text into one of the following two categories: 'question' or 'other'.

          Your task is to read the provided text and classify it based on the given categories. The text will be enclosed within << >>.
      
          Consider the text as a 'question' if:
          1. It is a question without a question mark (e.g., 'Could you please help me')
          2. It is an inversion of Subject and Auxilary Verb. In many question forms, especially in yes/no questions, the auxiliary (helping) verb precedes the subject.
      Example: "Is she coming today?" (The auxiliary verb "is" comes before the subject "she".)
          3. It starts with a question word. These include what, where, when, why, who, which, and how. These questions seek specific information.
      Example: "What time is the meeting?"
          4. It has the presence of Modal Verbs. Modal verbs like can, could, will, would, should, may, might, must often appear at the beginning of questions to ask about possibility, permission, or ability.
      Example: "Can you help me?"
          5. It has Tag Questions. These are short questions added at the end of a statement to turn the statement into a question. They usually repeat the auxiliary verb and subject in the reverse order.
      Example: "You're coming, aren't you?"
          6. It is Offering Choices. Questions sometimes present options and typically include "or" in the middle.
      Example: "Would you like tea or coffee?"
          7. It is Using Negative Forms. Questions can be formed negatively, often to express surprise or ask for confirmation.
      Example: "Isn't it raining?"
      
          Classify the text as 'other' if:
          1. It is a statement (e.g., 'Mary had a little lamb')
          2. It is an exclamation (e.g., 'Wow!', 'What on earth')
          3. It is a greeting (e.g., 'Hello')
          4. It is any other text that doesn't qualify as a question
      
          Here are some examples:
      
          Text: What is my name?
          question
      
          Text: hello
          other
      
          Text: Mary had a little lamb
          other
      
          Text: *
          other

          Text: ?
          other
      
          ###
      
          Text: <<${input}>>
          [INST] Only display 'question' or 'other' in the response[/INST]
          `,
      max_tokens: 2,
      n: 1,
    };

    const response = await this.http
      .post<MistralCompletionResponse>(`${environment.mistral_api}`, data)
      .toPromise();
    return response?.choices[0].text.trim().toLowerCase().includes('question') ?? false;
  }
}

export interface MistralCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
}

export interface Choice {
  index: number;
  text: string;
  logprobs: any;
  finish_reason: string;
}

export interface Usage {
  prompt_tokens: number;
  total_tokens: number;
  completion_tokens: number;
}
