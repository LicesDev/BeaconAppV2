import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarSedePage } from './gestionar-sede.page';

describe('GestionarSedePage', () => {
  let component: GestionarSedePage;
  let fixture: ComponentFixture<GestionarSedePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarSedePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
