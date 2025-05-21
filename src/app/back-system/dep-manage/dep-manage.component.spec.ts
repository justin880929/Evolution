import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepManageComponent } from './dep-manage.component';

describe('DepManageComponent', () => {
  let component: DepManageComponent;
  let fixture: ComponentFixture<DepManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepManageComponent]
    });
    fixture = TestBed.createComponent(DepManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
