import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTipoBuffetComponent } from './nuevo-tipo-buffet.component';

describe('NuevoTipoBuffetComponent', () => {
  let component: NuevoTipoBuffetComponent;
  let fixture: ComponentFixture<NuevoTipoBuffetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoTipoBuffetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoTipoBuffetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
