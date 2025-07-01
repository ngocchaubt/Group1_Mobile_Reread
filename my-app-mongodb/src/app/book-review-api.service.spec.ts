import { TestBed } from '@angular/core/testing';

import { BookReviewApiService } from './book-review-api.service';

describe('BookReviewApiService', () => {
  let service: BookReviewApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookReviewApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
