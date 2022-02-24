import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderDeleteComponent } from './loader-delete.component';

describe('LoaderDeleteComponent', () => {
  let component: LoaderDeleteComponent;
  let fixture: ComponentFixture<LoaderDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
