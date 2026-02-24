import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueSettingsComponent } from './boutique-settings.component';

describe('BoutiqueSettingsComponent', () => {
  let component: BoutiqueSettingsComponent;
  let fixture: ComponentFixture<BoutiqueSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
