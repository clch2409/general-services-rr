import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarColaboradorComponent } from './asignar-colaborador.component';

describe('AsignarColaboradorComponent', () => {
  let component: AsignarColaboradorComponent;
  let fixture: ComponentFixture<AsignarColaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarColaboradorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignarColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
