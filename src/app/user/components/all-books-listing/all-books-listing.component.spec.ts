import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBooksListingComponent } from './all-books-listing.component';

describe('AllBooksListingComponent', () => {
  let component: AllBooksListingComponent;
  let fixture: ComponentFixture<AllBooksListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllBooksListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBooksListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
