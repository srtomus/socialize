import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMessagesComponent } from './main-messages.component';

describe('MainMessagesComponent', () => {
  let component: MainMessagesComponent;
  let fixture: ComponentFixture<MainMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
