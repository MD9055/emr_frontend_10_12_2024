import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPhysicianComponent } from './view-physician.component';

describe('ViewPhysicianComponent', () => {
  let component: ViewPhysicianComponent;
  let fixture: ComponentFixture<ViewPhysicianComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPhysicianComponent]
    });
    fixture = TestBed.createComponent(ViewPhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
