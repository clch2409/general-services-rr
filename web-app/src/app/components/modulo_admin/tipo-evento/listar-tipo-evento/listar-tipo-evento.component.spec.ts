import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTipoEventoComponent } from './listar-tipo-evento.component';

describe('ListarTipoEventoComponent', () => {
  let component: ListarTipoEventoComponent;
  let fixture: ComponentFixture<ListarTipoEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarTipoEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarTipoEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
