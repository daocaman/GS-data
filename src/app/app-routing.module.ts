import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChildLayoutComponent } from './child-layout/child-layout.component';
import { HoaDonComponent } from './hoa-don/hoa-don.component';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent
  },
  {
    path: 'customer',
    component: ChildLayoutComponent
  },
  {
    path: 'order',
    component: ChildLayoutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
