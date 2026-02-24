import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBoutiqueCreationComponent } from './admin-boutique-creation.component';

describe('AdminBoutiqueCreationComponent', () => {
  let component: AdminBoutiqueCreationComponent;
  let fixture: ComponentFixture<AdminBoutiqueCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBoutiqueCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBoutiqueCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
