import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglepageComponent } from './singlepage.component';

describe('SinglepageComponent', () => {
  let component: SinglepageComponent;
  let fixture: ComponentFixture<SinglepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
