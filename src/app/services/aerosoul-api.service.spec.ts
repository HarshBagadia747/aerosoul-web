import { TestBed } from '@angular/core/testing';

import { AerosoulApiService } from './aerosoul-api.service';

describe('AerosoulApiService', () => {
  let service: AerosoulApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AerosoulApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
