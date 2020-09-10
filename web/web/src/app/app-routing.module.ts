import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CovidComponent } from './covid/covid.component';
import { TacosComponent } from './tacos/tacos.component';
import { SystemicRacismComponent } from './systemic-racism/systemic-racism.component';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "home"},
  {path: "home", component: HomeComponent},
  {path: "apps/covid", component: CovidComponent},
  {path: "apps/tacos", component: TacosComponent},
  {path: "apps/systemic-racism", component: SystemicRacismComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }