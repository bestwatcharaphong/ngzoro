import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  declarations: [AuthenticationComponent],
  imports: [
    SharedModule,
    AuthenticationRoutingModule,
    NzMessageModule,
    NzFormModule,
  ],
})
export class AuthenticationModule {}
