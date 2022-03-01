import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseStarComponent } from './choose-star.component';

describe('ChooseStarComponent', () => {
  let component: ChooseStarComponent;
  let fixture: ComponentFixture<ChooseStarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseStarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
