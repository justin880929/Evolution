import { TestBed } from '@angular/core/testing';

import { CourseAccessServiceService } from './course-access.service.service';

describe('CourseAccessServiceService', () => {
  let service: CourseAccessServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseAccessServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
