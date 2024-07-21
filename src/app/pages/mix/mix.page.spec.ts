import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MixPage } from './mix.page';

describe('MixPage', () => {
  let component: MixPage;
  let fixture: ComponentFixture<MixPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MixPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
