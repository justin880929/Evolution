import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashTagManageComponent } from './hash-tag-manage.component';

describe('HashTagManageComponent', () => {
  let component: HashTagManageComponent;
  let fixture: ComponentFixture<HashTagManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HashTagManageComponent]
    });
    fixture = TestBed.createComponent(HashTagManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
