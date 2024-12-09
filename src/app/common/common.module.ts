import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { CommonRoutingModule } from './common-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    // CommonRoutingModule
  ],
  exports: [SidebarComponent]
})
export class CommonModule { }
