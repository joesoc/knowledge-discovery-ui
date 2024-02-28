import { AfterViewInit, Directive, ElementRef, EventEmitter, OnInit, Output, inject } from '@angular/core';

@Directive({
    selector: '[appChatUrl]'
})
export class ChatUrlDirective implements AfterViewInit {
    private readonly elementRef = inject(ElementRef);

    @Output() urlClicked = new EventEmitter<string>();

    ngAfterViewInit(): void {
        // find any urls in the chat message and intercept their click event
        this.elementRef.nativeElement.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'A') {
                const href = target.getAttribute('href');

                if (!href) {
                    return;
                }

                event.preventDefault();
                this.urlClicked.emit(href);
            }
        });

    }
}