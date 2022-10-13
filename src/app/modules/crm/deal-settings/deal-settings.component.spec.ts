import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealSettingsComponent } from './deal-settings.component';

describe('DealSettingsComponent', () => {
  let component: DealSettingsComponent;
  let fixture: ComponentFixture<DealSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
