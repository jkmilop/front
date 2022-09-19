import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActividadComponent } from './list/actividad.component';
import { ActividadDetailComponent } from './detail/actividad-detail.component';
import { ActividadUpdateComponent } from './update/actividad-update.component';
import { ActividadDeleteDialogComponent } from './delete/actividad-delete-dialog.component';
import { ActividadRoutingModule } from './route/actividad-routing.module';

@NgModule({
  imports: [SharedModule, ActividadRoutingModule],
  declarations: [ActividadComponent, ActividadDetailComponent, ActividadUpdateComponent, ActividadDeleteDialogComponent],
})
export class ActividadModule {}
