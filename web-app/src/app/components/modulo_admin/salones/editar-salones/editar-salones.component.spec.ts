import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSalonesComponent } from './editar-salones.component';

describe('EditarSalonesComponent', () => {
  let component: EditarSalonesComponent;
  let fixture: ComponentFixture<EditarSalonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarSalonesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarSalonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
