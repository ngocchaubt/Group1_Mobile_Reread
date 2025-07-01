import { TestBed } from '@angular/core/testing';

import { DiscountApiService } from './discount-api.service';

describe('DiscountApiService', () => {
  let service: DiscountApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
