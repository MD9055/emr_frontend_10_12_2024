import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { SuperadminModule } from './superadmin/superadmin.module';
import { HeaderInterceptorInterceptor } from './_interceptor/header-interceptor.interceptor';
import { EncryptInterceptorInterceptor } from './_interceptor/encrypt-interceptor.interceptor'; // Add this
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { StoreModule } from '@ngrx/store';
import { reducers } from './stroreReducer/reducer';

import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AppComponent,
    // SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SuperadminModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    ToastrModule.forRoot({
      timeOut: 2000, 
      progressBar: true,
      closeButton: true,
       progressAnimation: 'increasing',
    }),
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({
    
      showForeground: true 
    }),
    NgSelectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}