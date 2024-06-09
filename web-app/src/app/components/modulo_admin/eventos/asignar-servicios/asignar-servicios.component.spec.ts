import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarServiciosComponent } from './asignar-servicios.component';

describe('AsignarServiciosComponent', () => {
  let component: AsignarServiciosComponent;
  let fixture: ComponentFixture<AsignarServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarServiciosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignarServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
