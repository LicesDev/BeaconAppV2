import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemuneracionesPage } from './remuneraciones.page';

describe('RemuneracionesPage', () => {
  let component: RemuneracionesPage;
  let fixture: ComponentFixture<RemuneracionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RemuneracionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
