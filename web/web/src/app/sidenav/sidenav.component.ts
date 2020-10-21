import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {MatAccordion} from "@angular/material/expansion";
import {EventEmitter} from "@angular/core";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Output() toggleMenuFromSideNav = new EventEmitter();

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor() { }

  ngOnInit(): void {
  }

  navigateToComponent(): void {
    this.accordion.closeAll();
    this.toggleMenuFromSideNav.emit(null);
  }

}
