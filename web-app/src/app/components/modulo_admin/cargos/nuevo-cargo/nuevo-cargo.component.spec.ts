import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoCargoComponent } from './nuevo-cargo.component';

describe('NuevoCargoComponent', () => {
  let component: NuevoCargoComponent;
  let fixture: ComponentFixture<NuevoCargoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoCargoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
