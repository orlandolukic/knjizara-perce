import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormBasicComponent } from './register-form-basic.component';

describe('RegisterFormBasicComponent', () => {
  let component: RegisterFormBasicComponent;
  let fixture: ComponentFixture<RegisterFormBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterFormBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
