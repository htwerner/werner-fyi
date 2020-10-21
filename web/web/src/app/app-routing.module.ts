import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CovidComponent } from './covid/covid.component';
import { TacosComponent } from './tacos/tacos.component';
import { SystemicRacismComponent } from './systemic-racism/systemic-racism.component';
import { PretzelsComponent } from "./pretzels/pretzels.component";

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "home"},
  {path: "home", component: HomeComponent},
  {path: "dashboards/covid", component: CovidComponent},
  {path: "dashboards/systemic-racism", component: SystemicRacismComponent},
  {path: "apps/pretzels", component: PretzelsComponent},
  {path: "apps/tacos", component: TacosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
