import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoSalonComponent } from './nuevo-salon.component';

describe('NuevoSalonComponent', () => {
  let component: NuevoSalonComponent;
  let fixture: ComponentFixture<NuevoSalonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoSalonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
