import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { AdminComponent } from './admin/admin.component';
import { PhysicianComponent } from './physician/physician.component';
import { PatientComponent } from './patient/patient.component';
import { LayoutComponent } from '../shared-module/layout/layout.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AuthGuard } from '../guards/auth.guard'; // Import the AuthGuard
import { ViewPhysicianComponent } from './view-physician/view-physician.component';
import { ViewPatientComponent } from './view-patient/view-patient.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        component: DashbaordComponent,
        canActivate: [AuthGuard],
        data: { roles: [0] },
      },
      {
        path: "admin",
        component: AdminComponent,
        canActivate: [AuthGuard], // Protect this route
        data: { roles: [0] },
      },
      {
        path: "physician",
        component: PhysicianComponent,
        canActivate: [AuthGuard],
        data: { roles: [0] }
      },
      {
        path: "patient",
        component: PatientComponent,
        canActivate: [AuthGuard],
         data: { roles: [0] }
      },
      {
        path: "add-admin",
        component: AddAdminComponent,
        canActivate: [AuthGuard],
         data: { roles: [0] }
      },
      {
        path: "view-physician",
        component: ViewPhysicianComponent,
        canActivate: [AuthGuard],
         data: { roles: [0] }
      },
      {
        path: "view-patient",
        component: ViewPatientComponent,
        canActivate: [AuthGuard],
         data: { roles: [0] }
      },
      {
        path:"settings",
        component:SettingComponent,
        canActivate: [AuthGuard],
        data: { roles: [0] }
      
    
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule { }
