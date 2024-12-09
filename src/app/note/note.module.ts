import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteRoutingModule } from './note-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotelistComponent } from './notelist/notelist.component';
import { NotesaddComponent } from './notesadd/notesadd.component';
import { AddModalComponent } from './notesadd/add-modal/add-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SignOffComponent } from './notesadd/sign-off/sign-off.component';

@NgModule({
  declarations: [
    NotelistComponent,
    NotesaddComponent,
    AddModalComponent,
    SignOffComponent
  ],
  imports: [
    CommonModule,
    NoteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class NoteModule { }
