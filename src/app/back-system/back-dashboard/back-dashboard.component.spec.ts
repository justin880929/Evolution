import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackDashboardComponent } from './back-dashboard.component';

describe('BackDashboardComponent', () => {
  let component: BackDashboardComponent;
  let fixture: ComponentFixture<BackDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackDashboardComponent]
    });
    fixture = TestBed.createComponent(BackDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
