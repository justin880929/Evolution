import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearingListComponent } from './learing-list.component';

describe('LearingListComponent', () => {
  let component: LearingListComponent;
  let fixture: ComponentFixture<LearingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearingListComponent]
    });
    fixture = TestBed.createComponent(LearingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
