import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonNavbarComponent } from './anon-navbar.component';

describe('AnonNavbarComponent', () => {
  let component: AnonNavbarComponent;
  let fixture: ComponentFixture<AnonNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
