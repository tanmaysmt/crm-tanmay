import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLeadsComponent } from './member-leads.component';

describe('MemberLeadsComponent', () => {
  let component: MemberLeadsComponent;
  let fixture: ComponentFixture<MemberLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberLeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
