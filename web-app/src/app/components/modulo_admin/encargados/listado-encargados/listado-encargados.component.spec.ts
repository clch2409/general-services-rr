import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoEncargadosComponent } from './listado-encargados.component';

describe('ListadoEncargadosComponent', () => {
  let component: ListadoEncargadosComponent;
  let fixture: ComponentFixture<ListadoEncargadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoEncargadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoEncargadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
