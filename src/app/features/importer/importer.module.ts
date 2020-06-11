import { NgModule } from '@angular/core';

import { ImporterRoutingModule } from './importer-routing.module';
import { ImporterComponent } from './importer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [ImporterComponent],
  imports: [
    SharedModule,
    NzUploadModule,
    NzMessageModule,
    NzIconModule,
    NzDividerModule,
    NzEmptyModule,
    NzProgressModule,
    NzModalModule,
    ImporterRoutingModule,
  ],
})
export class ImporterModule {}
