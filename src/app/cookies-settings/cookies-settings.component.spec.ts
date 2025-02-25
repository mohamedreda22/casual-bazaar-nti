import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesSettingsComponent } from './cookies-settings.component';

describe('CookiesSettingsComponent', () => {
  let component: CookiesSettingsComponent;
  let fixture: ComponentFixture<CookiesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiesSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookiesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
