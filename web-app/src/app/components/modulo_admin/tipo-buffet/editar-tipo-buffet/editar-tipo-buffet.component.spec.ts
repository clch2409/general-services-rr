import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTipoBuffetComponent } from './editar-tipo-buffet.component';

describe('EditarTipoBuffetComponent', () => {
  let component: EditarTipoBuffetComponent;
  let fixture: ComponentFixture<EditarTipoBuffetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTipoBuffetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarTipoBuffetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
