import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from "@angular/material/list";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  page_title: string;

  @ViewChild('appSelection') appSelection: MatSelectionList;

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
          } else if (url == '/apps/systemic-racism') {
            this.page_title = 'System Racism'
          } else if (url == '/apps/covid') {
            this.page_title = 'COVID-19'
          }
        }
      }
    )
  }

  deselectApps(): void {
    this.appSelection.deselectAll();
  }

}
