import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoInsumosComponent } from './listado-insumos.component';

describe('ListadoInsumosComponent', () => {
  let component: ListadoInsumosComponent;
  let fixture: ComponentFixture<ListadoInsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoInsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
