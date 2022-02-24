import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendBookComponent } from './recommend-book.component';

describe('RecommendBookComponent', () => {
  let component: RecommendBookComponent;
  let fixture: ComponentFixture<RecommendBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
