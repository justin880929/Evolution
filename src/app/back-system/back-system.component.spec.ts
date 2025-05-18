import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackSystemComponent } from './back-system.component';

describe('BackSystemComponent', () => {
  let component: BackSystemComponent;
  let fixture: ComponentFixture<BackSystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackSystemComponent]
    });
    fixture = TestBed.createComponent(BackSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
