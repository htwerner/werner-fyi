import {Component, OnInit, Output} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {EventEmitter} from "@angular/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() toggleMenuFromNavBar = new EventEmitter();

  page_title: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          let url = event.url;
          if (url == '/home') {
            this.page_title = 'Home';
          } else if (url == '/apps/tacos') {
            this.page_title = 'Tacos'
          } else if (url == '/dashboards/systemic-racism') {
            this.page_title = 'System Racism'
          } else if (url == '/dashboards/covid') {
            this.page_title = 'COVID-19'
          }
        }
      }
    )
  }

}
