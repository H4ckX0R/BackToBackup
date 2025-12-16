import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRolesPageComponent } from './admin-roles-page.component';

describe('AdminRolesPageComponent', () => {
  let component: AdminRolesPageComponent;
  let fixture: ComponentFixture<AdminRolesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRolesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRolesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
