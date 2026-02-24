import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBoxesComponent } from './admin-boxes.component';

describe('AdminBoxesComponent', () => {
  let component: AdminBoxesComponent;
  let fixture: ComponentFixture<AdminBoxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBoxesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
