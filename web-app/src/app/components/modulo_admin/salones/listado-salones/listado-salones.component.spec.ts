import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoSalonesComponent } from './listado-salones.component';

describe('ListadoSalonesComponent', () => {
  let component: ListadoSalonesComponent;
  let fixture: ComponentFixture<ListadoSalonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoSalonesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoSalonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
