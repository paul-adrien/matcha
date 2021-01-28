import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilMatchComponent } from './profil-match.component';

describe('ProfilMatchComponent', () => {
  let component: ProfilMatchComponent;
  let fixture: ComponentFixture<ProfilMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
