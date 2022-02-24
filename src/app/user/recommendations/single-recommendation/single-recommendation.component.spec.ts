import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRecommendationComponent } from './single-recommendation.component';

describe('SingleRecommendationComponent', () => {
  let component: SingleRecommendationComponent;
  let fixture: ComponentFixture<SingleRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleRecommendationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
