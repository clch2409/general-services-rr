import { TestBed } from '@angular/core/testing';

import { TipoEventoService } from './tipoEvento.service';

describe('TipoEventoService', () => {
  let service: TipoEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
