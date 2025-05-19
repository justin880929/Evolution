import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizzesManageComponent } from './quizzes-manage.component';

describe('QuizzesManageComponent', () => {
  let component: QuizzesManageComponent;
  let fixture: ComponentFixture<QuizzesManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizzesManageComponent]
    });
    fixture = TestBed.createComponent(QuizzesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
