import { Component, Input } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { DeviceDto } from '../../../../../api/models';
import { LazyLoadEvent } from 'primeng/api';
import { DevicesService } from '../../devices.service';
import { FileDto } from '../../../../../api/models';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { InplaceModule } from 'primeng/inplace';
import {
  bootstrapDownload,
  bootstrapFileEarmark,
  bootstrapFolder,
  bootstrapFileEarmarkImage,
  bootstrapFileEarmarkPdf,
  bootstrapFileEarmarkPlay,
  bootstrapFileEarmarkMusic,
  bootstrapFileEarmarkZip,
  bootstrapFileEarmarkText,
  bootstrapList,
  bootstrapGrid,
  bootstrapArrowUp,
  bootstrapPcDisplay,
} from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-file-explorer',
  imports: [
    FormsModule,
    DataViewModule,
    CardModule,
    BadgeModule,
    ButtonModule,
    NgIcon,
    BreadcrumbModule,
    InplaceModule,
    InputTextModule,
    ToolbarModule,
    SelectButtonModule,
  ],
  providers: [
    provideIcons({
      bootstrapDownload,
      bootstrapFileEarmark,
      bootstrapFolder,
      bootstrapFileEarmarkImage,
      bootstrapFileEarmarkPdf,
      bootstrapFileEarmarkPlay,
      bootstrapFileEarmarkMusic,
      bootstrapFileEarmarkZip,
      bootstrapFileEarmarkText,
      bootstrapList,
      bootstrapGrid,
      bootstrapArrowUp,
      bootstrapPcDisplay,
    }),
  ],
  templateUrl: './file-explorer.component.html',
  styleUrl: './file-explorer.component.css',
})
export class FileExplorerComponent {
  @Input() device: DeviceDto | null = null;
  files: FileDto[] = [];
  items: MenuItem[] = [
    {
      label: '/',
      path: '/',
      command: () => {
        this.navigateTo(1);
      },
    },
  ];
  fullPath: string = '';
  editBreadcrumb: boolean = false;
  displayOptions: any[] = [
    { label: 'List', value: 'list', icon: 'bootstrapList' },
    { label: 'Grid', value: 'grid', icon: 'bootstrapGrid', disabled: true },
  ];
  value: "list" | "grid" = 'list';

  constructor(private deviceService: DevicesService) {}

  onLazyLoad(event?: LazyLoadEvent) {
    this.buildFullPath();
    this.deviceService
      .getFiles(this.device?.id || '', this.fullPath)
      .subscribe((files: FileDto[]) => {
        this.files = files;
      });
  }

  buildFullPath() {
    this.fullPath = this.items.map((item) => item['path']).join('/').replace(/\/\//g, '/');
  }

  openFolder(path: string) {
    const depth = this.items.length + 1;
    this.items = [
      ...this.items,
      {
        label: path,
        path: path,
        command: () => {
          this.navigateTo(depth);
        },
      },
    ];
    this.onLazyLoad();
  }

  navigateTo(depth: number) {
    this.items = this.items.slice(0, depth);
    this.onLazyLoad();
  }

  navigateToPath(path: string) {
    this.items = path
      .split('/')
      .filter((item) => item !== '')
      .map((item, index) => {
          return {
            label: item,
            path: item,
            command: () => {
              this.navigateTo(index + 2);
            },
          };
      });

      if (this.items[0]['path'] !== '/') {
        this.items.unshift({
          label: '/',
          path: '/',
          command: () => {
            this.navigateTo(1);
          },
        });
      }
      console.log(this.items);
    this.onLazyLoad();
  }
}
