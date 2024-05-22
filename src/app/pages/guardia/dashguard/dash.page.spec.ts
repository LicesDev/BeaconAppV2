import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashPage } from './dash.page';

describe('DashPage', () => {
  let component: DashPage;
  let fixture: ComponentFixture<DashPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
