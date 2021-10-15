import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChildLayoutComponent } from './child-layout/child-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent
  },
  {
    path: 'new-customer',
    component: ChildLayoutComponent
  },
  {
    path: 'edit-customer',
    component: ChildLayoutComponent
  },
  {
    path: 'new-order',
    component: ChildLayoutComponent
  },
  {
    path: 'edit-order',
    component: ChildLayoutComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
