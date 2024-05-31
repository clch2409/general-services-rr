import { TestBed } from '@angular/core/testing';

import { EncargadoSalonService } from './encargadoSalon.service';

describe('EncargadoSalonService', () => {
  let service: EncargadoSalonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncargadoSalonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
