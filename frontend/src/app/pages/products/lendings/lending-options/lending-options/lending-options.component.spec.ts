import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LendingOptionsComponent } from './lending-options.component';

describe('LendingOptionsComponent', () => {
  let component: LendingOptionsComponent;
  let fixture: ComponentFixture<LendingOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LendingOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LendingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
