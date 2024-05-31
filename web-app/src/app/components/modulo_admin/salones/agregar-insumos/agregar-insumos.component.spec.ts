import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarInsumosComponent } from './agregar-insumos.component';

describe('AgregarInsumosComponent', () => {
  let component: AgregarInsumosComponent;
  let fixture: ComponentFixture<AgregarInsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarInsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
