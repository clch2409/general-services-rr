import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoInsumoComponent } from './nuevo-insumo.component';

describe('NuevoInsumoComponent', () => {
  let component: NuevoInsumoComponent;
  let fixture: ComponentFixture<NuevoInsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoInsumoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
