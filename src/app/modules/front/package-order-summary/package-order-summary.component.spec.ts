import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageOrderSummaryComponent } from './package-order-summary.component';

describe('PackageOrderSummaryComponent', () => {
  let component: PackageOrderSummaryComponent;
  let fixture: ComponentFixture<PackageOrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageOrderSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
