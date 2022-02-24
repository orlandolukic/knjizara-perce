import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendNumbersContentComponent } from './recommend-numbers-content.component';

describe('RecommendNumbersContentComponent', () => {
  let component: RecommendNumbersContentComponent;
  let fixture: ComponentFixture<RecommendNumbersContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendNumbersContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendNumbersContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
