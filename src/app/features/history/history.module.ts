import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { NzTableModule } from 'ng-zorro-antd/table';
@NgModule({
  declarations: [HistoryComponent],
  imports: [SharedModule, HistoryRoutingModule, NzTableModule],
})
export class HistoryModule {}
