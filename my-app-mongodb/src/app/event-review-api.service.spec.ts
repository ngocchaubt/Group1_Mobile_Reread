import { TestBed } from '@angular/core/testing';

import { EventReviewApiService } from './event-review-api.service';

describe('EventReviewApiService', () => {
  let service: EventReviewApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventReviewApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
