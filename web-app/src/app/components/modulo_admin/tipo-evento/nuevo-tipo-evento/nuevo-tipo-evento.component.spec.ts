import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTipoEventoComponent } from './nuevo-tipo-evento.component';

describe('NuevoTipoEventoComponent', () => {
  let component: NuevoTipoEventoComponent;
  let fixture: ComponentFixture<NuevoTipoEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoTipoEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoTipoEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
