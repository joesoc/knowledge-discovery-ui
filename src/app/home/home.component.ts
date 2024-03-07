import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [HeaderComponent]
})
export class HomeComponent {
  title: string = 'Home';
}
