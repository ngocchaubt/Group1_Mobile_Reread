import { TestBed } from '@angular/core/testing';

import { EventRegistrationApiService } from './event-registration-api.service';

describe('EventRegistrationApiService', () => {
  let service: EventRegistrationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRegistrationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
