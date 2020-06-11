import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImporterComponent } from './importer.component';

const routes: Routes = [{ path: '', component: ImporterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImporterRoutingModule { }
