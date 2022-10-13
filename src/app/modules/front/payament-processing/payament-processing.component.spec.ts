import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayamentProcessingComponent } from './payament-processing.component';

describe('PayamentProcessingComponent', () => {
  let component: PayamentProcessingComponent;
  let fixture: ComponentFixture<PayamentProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayamentProcessingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayamentProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
