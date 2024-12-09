import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhysicianComponent } from './add-physician.component';

describe('AddPhysicianComponent', () => {
  let component: AddPhysicianComponent;
  let fixture: ComponentFixture<AddPhysicianComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPhysicianComponent]
    });
    fixture = TestBed.createComponent(AddPhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
