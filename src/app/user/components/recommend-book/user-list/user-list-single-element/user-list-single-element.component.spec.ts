import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListSingleElementComponent } from './user-list-single-element.component';

describe('UserListSingleElementComponent', () => {
  let component: UserListSingleElementComponent;
  let fixture: ComponentFixture<UserListSingleElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListSingleElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListSingleElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
