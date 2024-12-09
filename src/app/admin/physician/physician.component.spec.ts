import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianComponent } from './physician.component';

describe('PhysicianComponent', () => {
  let component: PhysicianComponent;
  let fixture: ComponentFixture<PhysicianComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicianComponent]
    });
    fixture = TestBed.createComponent(PhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
