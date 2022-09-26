import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DesarrolloComponent } from './list/desarrollo.component';
import { DesarrolloDetailComponent } from './detail/desarrollo-detail.component';
import { DesarrolloUpdateComponent } from './update/desarrollo-update.component';
import { DesarrolloDeleteDialogComponent } from './delete/desarrollo-delete-dialog.component';
import { DesarrolloRoutingModule } from './route/desarrollo-routing.module';

@NgModule({
  imports: [SharedModule, DesarrolloRoutingModule],
  declarations: [DesarrolloComponent, DesarrolloDetailComponent, DesarrolloUpdateComponent, DesarrolloDeleteDialogComponent],
})
export class BackDesarrolloModule {}
