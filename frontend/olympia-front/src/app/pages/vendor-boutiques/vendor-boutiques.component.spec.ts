import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBoutiquesComponent } from './vendor-boutiques.component';

describe('VendorBoutiquesComponent', () => {
  let component: VendorBoutiquesComponent;
  let fixture: ComponentFixture<VendorBoutiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorBoutiquesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorBoutiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
