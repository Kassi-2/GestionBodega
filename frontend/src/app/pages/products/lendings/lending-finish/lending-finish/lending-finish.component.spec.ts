import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LendingFinishComponent } from './lending-finish.component';

describe('LendingFinishComponent', () => {
  let component: LendingFinishComponent;
  let fixture: ComponentFixture<LendingFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LendingFinishComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LendingFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
