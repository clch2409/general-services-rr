import { TestBed } from '@angular/core/testing';

import { TipoBuffetService } from './tipoBuffet.service';

describe('TipoBuffetService', () => {
  let service: TipoBuffetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoBuffetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
