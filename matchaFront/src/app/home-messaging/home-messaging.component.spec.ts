import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMessagingComponent } from './home-messaging.component';

describe('HomeMessagingComponent', () => {
  let component: HomeMessagingComponent;
  let fixture: ComponentFixture<HomeMessagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMessagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
