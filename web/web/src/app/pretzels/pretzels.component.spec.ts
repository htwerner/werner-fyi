import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PretzelsComponent } from './pretzels.component';

describe('PretzelsComponent', () => {
  let component: PretzelsComponent;
  let fixture: ComponentFixture<PretzelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PretzelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PretzelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
