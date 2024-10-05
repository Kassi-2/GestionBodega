import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LendingActiveComponent } from './lending-active.component';

describe('LendingActiveComponent', () => {
  let component: LendingActiveComponent;
  let fixture: ComponentFixture<LendingActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LendingActiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LendingActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
