import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherStaffRoutingModule } from './other-staff-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { PatientComponent } from './patient/patient.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PatientComponent
  ],
  imports: [
    CommonModule,
    OtherStaffRoutingModule,
    SharedModuleModule
  ]
})
export class OtherStaffModule { }
