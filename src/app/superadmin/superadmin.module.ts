import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperadminRoutingModule } from './superadmin-routing.module';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { AdminComponent } from './admin/admin.component';
import { PatientComponent } from './patient/patient.component';
import { PhysicianComponent } from './physician/physician.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeletePopupComponent } from '../shared-module/commonComponents/delete-popup/delete-popup.component';
import { ViewPhysicianComponent } from './view-physician/view-physician.component';
import { ViewPatientComponent } from './view-patient/view-patient.component';


@NgModule({
  declarations: [
    DashbaordComponent,
    AdminComponent,
    PatientComponent,
    PhysicianComponent,
    AddAdminComponent,
    ViewPhysicianComponent,
    ViewPatientComponent,
  ],
  imports: [
    CommonModule,
    SuperadminRoutingModule,
    SharedModuleModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SuperadminModule { }
