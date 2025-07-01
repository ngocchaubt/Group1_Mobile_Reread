import { TestBed } from '@angular/core/testing';

import { QuotationApiService } from './quotation-api.service';

describe('QuotationApiService', () => {
  let service: QuotationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuotationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
