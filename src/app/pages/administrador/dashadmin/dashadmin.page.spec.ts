import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashadminPage } from './dashadmin.page';

describe('DashadminPage', () => {
  let component: DashadminPage;
  let fixture: ComponentFixture<DashadminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
