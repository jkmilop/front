import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EstudianteCursoComponent } from './list/estudiante-curso.component';
import { EstudianteCursoDetailComponent } from './detail/estudiante-curso-detail.component';
import { EstudianteCursoUpdateComponent } from './update/estudiante-curso-update.component';
import { EstudianteCursoDeleteDialogComponent } from './delete/estudiante-curso-delete-dialog.component';
import { EstudianteCursoRoutingModule } from './route/estudiante-curso-routing.module';

@NgModule({
  imports: [SharedModule, EstudianteCursoRoutingModule],
  declarations: [
    EstudianteCursoComponent,
    EstudianteCursoDetailComponent,
    EstudianteCursoUpdateComponent,
    EstudianteCursoDeleteDialogComponent,
  ],
})
export class BackEstudianteCursoModule {}
