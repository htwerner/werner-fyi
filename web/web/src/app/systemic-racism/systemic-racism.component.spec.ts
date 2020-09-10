import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemicRacismComponent } from './systemic-racism.component';

describe('SystemicRacismComponent', () => {
  let component: SystemicRacismComponent;
  let fixture: ComponentFixture<SystemicRacismComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemicRacismComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemicRacismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
