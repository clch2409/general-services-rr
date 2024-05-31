import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoRolesComponent } from './listado-roles.component';

describe('ListadoRolesComponent', () => {
  let component: ListadoRolesComponent;
  let fixture: ComponentFixture<ListadoRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
