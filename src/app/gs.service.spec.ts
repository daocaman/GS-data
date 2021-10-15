import { TestBed } from '@angular/core/testing';

import { GsService } from './gs.service';

describe('GsService', () => {
  let service: GsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
