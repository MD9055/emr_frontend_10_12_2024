import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PhysicianComponent } from './physician/physician.component';
import { PatientComponent } from './patient/patient.component';
import { AddPhysicianComponent } from './add-physician/add-physician.component';
import { StaffComponent } from './staff/staff.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { ViewPhysicianComponent } from './view-physician/view-physician.component';
import { ViewPatientComponent } from './view-patient/view-patient.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PhysicianComponent,
    PatientComponent,
    AddPhysicianComponent,
    StaffComponent,
    AddStaffComponent,
    ViewPhysicianComponent,
    ViewPatientComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModuleModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class AdminModule { }
