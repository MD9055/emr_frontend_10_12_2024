import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesaddComponent } from './notesadd.component';

describe('NotesaddComponent', () => {
  let component: NotesaddComponent;
  let fixture: ComponentFixture<NotesaddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotesaddComponent]
    });
    fixture = TestBed.createComponent(NotesaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
