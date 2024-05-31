import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTipoEventoComponent } from './editar-tipo-evento.component';

describe('EditarTipoEventoComponent', () => {
  let component: EditarTipoEventoComponent;
  let fixture: ComponentFixture<EditarTipoEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTipoEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarTipoEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
