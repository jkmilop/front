import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MatriculaComponent } from './list/matricula.component';
import { MatriculaDetailComponent } from './detail/matricula-detail.component';
import { MatriculaUpdateComponent } from './update/matricula-update.component';
import { MatriculaDeleteDialogComponent } from './delete/matricula-delete-dialog.component';
import { MatriculaRoutingModule } from './route/matricula-routing.module';

@NgModule({
  imports: [SharedModule, MatriculaRoutingModule],
  declarations: [MatriculaComponent, MatriculaDetailComponent, MatriculaUpdateComponent, MatriculaDeleteDialogComponent],
})
export class MatriculaModule {}
