import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFeedbacksComponent } from './member-feedbacks.component';

describe('MemberFeedbacksComponent', () => {
  let component: MemberFeedbacksComponent;
  let fixture: ComponentFixture<MemberFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberFeedbacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
