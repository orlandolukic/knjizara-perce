import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderSuccessfulComponent } from './loader-successful.component';

describe('LoaderSuccessfulComponent', () => {
  let component: LoaderSuccessfulComponent;
  let fixture: ComponentFixture<LoaderSuccessfulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderSuccessfulComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
