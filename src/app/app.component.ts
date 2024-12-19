import { Component } from '@angular/core';
import { SelectListComponent } from './components/select-list/select-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SelectListComponent],
  template: `
    <h1>{{ title }}</h1>
    <app-select-list></app-select-list>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'dropdown-select';
}
