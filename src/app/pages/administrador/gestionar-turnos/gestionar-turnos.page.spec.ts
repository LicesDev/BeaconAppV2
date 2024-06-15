import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarTurnosPage } from './gestionar-turnos.page';

describe('GestionarTurnosPage', () => {
  let component: GestionarTurnosPage;
  let fixture: ComponentFixture<GestionarTurnosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarTurnosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
