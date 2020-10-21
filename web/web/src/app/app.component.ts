import {Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'web';

  menu_open: boolean = true;
  open_menu_urls: Array<string> = [
    "/home"
  ]
  close_menu_urls: Array<string> = [
    "/dashboards/covid",
    "/dashboards/systemic-racism",
    "/apps/pretzels",
    "/apps/tacos"
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.open_menu_urls.indexOf(event.urlAfterRedirects) !== -1) {
          this.openMenu();
        } else if (this.close_menu_urls.indexOf(event.urlAfterRedirects) !== -1) {
          this.closeMenu();
        }
      }
    });
  }

  toggleMenu(): void {
    this.menu_open = !this.menu_open
  }

  openMenu(): void {
    this.menu_open = true;
  }

  closeMenu(): void {
    this.menu_open = false;
  }
}
