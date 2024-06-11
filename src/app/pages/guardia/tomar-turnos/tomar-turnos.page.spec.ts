import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TomarTurnosPage } from './tomar-turnos.page';

describe('TomarTurnosPage', () => {
  let component: TomarTurnosPage;
  let fixture: ComponentFixture<TomarTurnosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TomarTurnosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
