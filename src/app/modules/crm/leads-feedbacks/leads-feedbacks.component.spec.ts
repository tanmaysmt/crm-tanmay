import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsFeedbacksComponent } from './leads-feedbacks.component';

describe('LeadsFeedbacksComponent', () => {
  let component: LeadsFeedbacksComponent;
  let fixture: ComponentFixture<LeadsFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsFeedbacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
