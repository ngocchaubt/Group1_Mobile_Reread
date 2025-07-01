import { TestBed } from '@angular/core/testing';

import { MembershipApiService } from './membership-api.service';

describe('MembershipApiService', () => {
  let service: MembershipApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
