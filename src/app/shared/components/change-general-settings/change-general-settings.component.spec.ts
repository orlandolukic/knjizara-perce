import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeGeneralSettingsComponent } from './change-general-settings.component';

describe('ChangeGeneralSettingsComponent', () => {
  let component: ChangeGeneralSettingsComponent;
  let fixture: ComponentFixture<ChangeGeneralSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeGeneralSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeGeneralSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
