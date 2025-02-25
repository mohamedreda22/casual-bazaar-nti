import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsPolicyComponent } from './returns-policy.component';

describe('ReturnsPolicyComponent', () => {
  let component: ReturnsPolicyComponent;
  let fixture: ComponentFixture<ReturnsPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnsPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnsPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
