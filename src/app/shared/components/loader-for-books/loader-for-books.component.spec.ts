import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderForBooksComponent } from './loader-for-books.component';

describe('LoaderForBooksComponent', () => {
  let component: LoaderForBooksComponent;
  let fixture: ComponentFixture<LoaderForBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderForBooksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderForBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
