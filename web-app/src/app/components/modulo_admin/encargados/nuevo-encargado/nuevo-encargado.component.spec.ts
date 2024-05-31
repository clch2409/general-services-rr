import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoEncargadoComponent } from './nuevo-encargado.component';

describe('NuevoEncargadoComponent', () => {
  let component: NuevoEncargadoComponent;
  let fixture: ComponentFixture<NuevoEncargadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoEncargadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoEncargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
