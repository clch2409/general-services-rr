import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInsumosComponent } from './editar-insumos.component';

describe('EditarInsumosComponent', () => {
  let component: EditarInsumosComponent;
  let fixture: ComponentFixture<EditarInsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarInsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
