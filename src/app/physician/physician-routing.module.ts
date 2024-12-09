import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { LayoutComponent } from '../shared-module/layout/layout.component';
import { AuthGuard } from '../guards/auth.guard';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';

// const routes: Routes = [
//   {
//     path:"patient", component:PatientComponent
//   },
//   {
//     path:"add-patient", component:AddPatientComponent
//   }
// ];

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
        data: { roles: [2] },
      },

        {
          path:"patient", 
           component:PatientComponent,
           canActivate: [AuthGuard],
           data: { roles: [2] },
        },
        {
          path:"add-patient", 
          component:AddPatientComponent,
          canActivate: [AuthGuard],
          data: { roles: [2] },

        },

        {
          path:"edit-patient", 
          component:EditPatientComponent,
          canActivate: [AuthGuard],
          data: { roles: [2] },

        }
            
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysicianRoutingModule { }
