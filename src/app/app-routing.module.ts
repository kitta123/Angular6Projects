import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BootstrapDemoComponent } from './bootstrap/bootstrap-demo/bootstrap-demo.component';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';



const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'bootstrap', component: BootstrapDemoComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'employees', loadChildren: './employee/employee.module#EmployeeModule'},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
