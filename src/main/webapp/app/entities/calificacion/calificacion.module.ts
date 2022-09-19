import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CalificacionComponent } from './list/calificacion.component';
import { CalificacionDetailComponent } from './detail/calificacion-detail.component';
import { CalificacionUpdateComponent } from './update/calificacion-update.component';
import { CalificacionDeleteDialogComponent } from './delete/calificacion-delete-dialog.component';
import { CalificacionRoutingModule } from './route/calificacion-routing.module';

@NgModule({
  imports: [SharedModule, CalificacionRoutingModule],
  declarations: [CalificacionComponent, CalificacionDetailComponent, CalificacionUpdateComponent, CalificacionDeleteDialogComponent],
})
export class CalificacionModule {}
