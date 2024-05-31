import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoverInsumosComponent } from './mover-insumos.component';

describe('MoverInsumosComponent', () => {
  let component: MoverInsumosComponent;
  let fixture: ComponentFixture<MoverInsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoverInsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoverInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
