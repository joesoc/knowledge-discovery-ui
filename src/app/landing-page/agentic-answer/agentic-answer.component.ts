import { Component, computed, inject, input, Input, SimpleChanges } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideThumbsDown, lucideThumbsUp, lucideXCircle } from '@ng-icons/lucide';
import { ChatCompletion } from 'src/app/interfaces/IChatCompletionResponse';
import MarkdownIt from 'markdown-it';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-agentic-answer',
    templateUrl: './agentic-answer.component.html',
    standalone: true,
    imports: [DecimalPipe],
    viewProviders: [provideIcons({lucideXCircle, lucideThumbsUp, lucideThumbsDown})]
})
export class AgenticAnswerComponent {
  readonly answer = input.required<ChatCompletion>();
  readonly question = input<string>();
  readonly duration = input<number>();
  readonly markdown = new MarkdownIt({ html: true, });

  readonly content = computed(() => this.markdown.render(this.answer().choices[0]?.message.content ?? ''));
}
