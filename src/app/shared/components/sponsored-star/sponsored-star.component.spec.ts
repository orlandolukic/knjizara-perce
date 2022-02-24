import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredStarComponent } from './sponsored-star.component';

describe('SponsoredStarComponent', () => {
  let component: SponsoredStarComponent;
  let fixture: ComponentFixture<SponsoredStarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsoredStarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
