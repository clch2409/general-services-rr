import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTipoBuffetComponent } from './listar-tipo-buffet.component';

describe('ListarTipoBuffetComponent', () => {
  let component: ListarTipoBuffetComponent;
  let fixture: ComponentFixture<ListarTipoBuffetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarTipoBuffetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarTipoBuffetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
