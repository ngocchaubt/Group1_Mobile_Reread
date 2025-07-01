import { TestBed } from '@angular/core/testing';

import { BookStockApiService } from './book-stock-api.service';

describe('BookStockApiService', () => {
  let service: BookStockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookStockApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
