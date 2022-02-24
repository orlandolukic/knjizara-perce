import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSliderSingleBookComponent } from './book-slider-single-book.component';

describe('BookSliderSingleBookComponent', () => {
  let component: BookSliderSingleBookComponent;
  let fixture: ComponentFixture<BookSliderSingleBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookSliderSingleBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSliderSingleBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
