import { TestBed } from '@angular/core/testing';

import { BookinfoApiService } from './bookinfo-api.service';

describe('BookinfoApiService', () => {
  let service: BookinfoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookinfoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
