import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTransferComponent } from './lead-transfer.component';

describe('LeadTransferComponent', () => {
  let component: LeadTransferComponent;
  let fixture: ComponentFixture<LeadTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
