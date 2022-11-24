import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContattiComponent } from './componenti/contatti/contatti.component';
import { ContattoComponent } from './componenti/contatto/contatto.component';
import { IndexComponent } from './componenti/index/index.component';


const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'sidebarcontatti', component: ContattiComponent, children: [
    { path: ':id', component: ContattoComponent},
    { path: ':id/:mod', component: ContattoComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
