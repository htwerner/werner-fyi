import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'web';

  menu_open: boolean = true;

  toggleMenu(): void {
    this.menu_open = !this.menu_open
  }
}
