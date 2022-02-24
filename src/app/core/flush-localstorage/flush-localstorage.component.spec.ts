import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlushLocalstorageComponent } from './flush-localstorage.component';

describe('FlushLocalstorageComponent', () => {
  let component: FlushLocalstorageComponent;
  let fixture: ComponentFixture<FlushLocalstorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlushLocalstorageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlushLocalstorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
