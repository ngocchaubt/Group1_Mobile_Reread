import { TestBed } from '@angular/core/testing';

import { SaleOrderAPIService } from './sale-order-api.service';

describe('SaleOrderAPIService', () => {
  let service: SaleOrderAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleOrderAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
