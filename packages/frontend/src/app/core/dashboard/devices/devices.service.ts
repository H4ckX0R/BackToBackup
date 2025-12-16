import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceDto, FileDto, NewDeviceDto } from '../../../api/models';
import { DeviceService } from '../../../api/services/device.service';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  constructor(private apiDevice: DeviceService) {

   }

   getDevices(): Observable<DeviceDto[]> {
    return this.apiDevice.deviceControllerGetMyDevices();
   }

   addDevice(device: NewDeviceDto): Observable<string> {
    return this.apiDevice.deviceControllerAddNewDevice({
      body: device
    });
   }

   getFiles(deviceId: string, path?: string): Observable<FileDto[]> {
    return this.apiDevice.deviceControllerGetListOfFiles({
      deviceId: deviceId,
      path: path
    });
   }
}
