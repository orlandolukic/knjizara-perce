import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormFinishComponent } from './register-form-finish.component';

describe('RegisterFormFinishComponent', () => {
  let component: RegisterFormFinishComponent;
  let fixture: ComponentFixture<RegisterFormFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterFormFinishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
