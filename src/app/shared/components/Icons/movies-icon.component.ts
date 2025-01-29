import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-movies',
  standalone: true,
  template: `
    <div class="icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class]="iconClass">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
          <path d="M16 3l-4 4l-4 -4" />
      </svg>
    </div>
  `
})
export class MoviesIconComponent {
    @Input() iconClass: string = '';
}