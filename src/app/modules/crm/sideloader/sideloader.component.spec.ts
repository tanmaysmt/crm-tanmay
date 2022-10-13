import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideloaderComponent } from './sideloader.component';

describe('SideloaderComponent', () => {
  let component: SideloaderComponent;
  let fixture: ComponentFixture<SideloaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideloaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
