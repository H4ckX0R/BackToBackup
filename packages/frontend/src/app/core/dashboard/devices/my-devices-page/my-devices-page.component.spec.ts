import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDevicesPageComponent } from './my-devices-page.component';

describe('MyDevicesPageComponent', () => {
  let component: MyDevicesPageComponent;
  let fixture: ComponentFixture<MyDevicesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDevicesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDevicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
