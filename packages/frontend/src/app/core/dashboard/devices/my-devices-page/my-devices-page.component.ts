
import { Component } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { bootstrapCpu, bootstrapWindowPlus, bootstrapXLg, bootstrapThreeDots, bootstrapFolder, bootstrapArrowLeft } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DeviceDto, NewDeviceDto } from '../../../../api/models';
import { DevicesService } from '../devices.service';
import { CardModule } from 'primeng/card';
import { FileExplorerComponent } from "../components/file-explorer/file-explorer.component";


@Component({
  selector: 'app-my-devices-page',
  imports: [
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    BadgeModule,
    InputTextModule,
    ListboxModule,
    DividerModule,
    MessageModule,
    NgIcon,
    CardModule,
    FileExplorerComponent
],
  providers: [provideIcons({ bootstrapWindowPlus, bootstrapCpu, bootstrapXLg, bootstrapThreeDots, bootstrapFolder, bootstrapArrowLeft })],
  templateUrl: './my-devices-page.component.html',
  styleUrl: './my-devices-page.component.css'
})
export class MyDevicesPageComponent {
  devices: DeviceDto[] = [];
  selectedDevice: DeviceDto | null = null;
  newDeviceForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  showTokenDialog = false;
  explorerOpen = false;
  registerTokenDialog: string | null = null;

  constructor(private devicesService: DevicesService) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices() {
    this.devicesService.getDevices().subscribe((devices: DeviceDto[]) => {
      console.log(devices);
      this.devices = devices;
    });
  }

  addDevice() {
    this.devicesService.addDevice(this.newDeviceForm.value as NewDeviceDto).subscribe((token: string) => {
      console.log(token);
      this.loadDevices();
      this.showAddDialog = false;
      this.registerTokenDialog = token;
      this.showTokenDialog = true;
    });
  }

  openExplorer() {
    this.explorerOpen = true;
  }

  

























  showAddDialog = false;
  newDevice: Partial<DeviceDto> = {};

  openAdd(): void {
    this.newDevice = {};
    this.showAddDialog = true;
  }
/* 
  addDevice(): void {
    if (this.newDevice.name && this.newDevice.type) {
      const nextId =
        this.devices.length > 0
          ? Math.max(...this.devices.map((d) => d.id)) + 1
          : 1;

      this.devices.push({
        id: nextId,
        name: this.newDevice.name,
        type: this.newDevice.type,
        status: 'offline'
      } as DeviceDto);
      this.showAddDialog = false;
    }
  }

  openDetails(device: TableRowSelectEvent<DeviceDto>): void {
    this.selectedDevice = device.data;
  } */
}
