import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueVentesComponent } from './boutique-ventes.component';

describe('BoutiqueVentesComponent', () => {
  let component: BoutiqueVentesComponent;
  let fixture: ComponentFixture<BoutiqueVentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueVentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
