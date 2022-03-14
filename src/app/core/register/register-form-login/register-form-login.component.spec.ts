import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormLoginComponent } from './register-form-login.component';

describe('RegisterFormLoginComponent', () => {
  let component: RegisterFormLoginComponent;
  let fixture: ComponentFixture<RegisterFormLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterFormLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
