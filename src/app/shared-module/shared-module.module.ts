import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleRoutingModule } from './shared-module-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { DeletePopupComponent } from './commonComponents/delete-popup/delete-popup.component';
import { ForbiddenComponent } from './commonComponents/forbidden/forbidden.component';
import { SettingComponent } from '../superadmin/setting/setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    LayoutComponent,
    DeletePopupComponent,
    ForbiddenComponent,
    SettingComponent
  ],
  imports: [
    CommonModule,
    SharedModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [SidebarComponent, HeaderComponent, DeletePopupComponent, ForbiddenComponent]
})
export class SharedModuleModule { }
