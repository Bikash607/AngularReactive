import { PageNotFoundComponent } from './pageNotFound/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'employee', loadChildren: () => import('./employee/employee.module').then(mod => mod.EmployeeModule)},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  // preloading leazy loaded modules
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
