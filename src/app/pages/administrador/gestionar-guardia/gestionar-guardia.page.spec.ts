import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarGuardiaPage } from './gestionar-guardia.page';

describe('GestionarGuardiaPage', () => {
  let component: GestionarGuardiaPage;
  let fixture: ComponentFixture<GestionarGuardiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarGuardiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
