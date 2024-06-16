import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarIncidenciasPage } from './gestionar-incidencias.page';

describe('GestionarIncidenciasPage', () => {
  let component: GestionarIncidenciasPage;
  let fixture: ComponentFixture<GestionarIncidenciasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarIncidenciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
