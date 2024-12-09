import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupProfileComponent } from './auth/setup-profile/setup-profile.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForbiddenComponent } from './shared-module/commonComponents/forbidden/forbidden.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'superadmin',
    loadChildren: () => import('./superadmin/superadmin.module').then(m => m.SuperadminModule),
    
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    
  },
  {
    path: 'physician',
    loadChildren: () => import('./physician/physician.module').then(m => m.PhysicianModule),
    
  },
  {
    path: 'staff',
    loadChildren: () => import('./other-staff/other-staff.module').then(m => m.OtherStaffModule),
    
  },
  {
    path: 'notes',
    loadChildren: () => import('./note/note.module').then(m => m.NoteModule),
    
  },
  {
    path:"setup-profile",
    component:SetupProfileComponent
  },
  {
    path:"forget-password",
    component:ForgetPasswordComponent
  },
  {
    path:"reset-password",
    component:ResetPasswordComponent
  },
  {
    path:"forbidden",
    component:ForbiddenComponent,
    

  },
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
