import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurnoActivoPage } from './turno-activo.page';

describe('TurnoActivoPage', () => {
  let component: TurnoActivoPage;
  let fixture: ComponentFixture<TurnoActivoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoActivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
