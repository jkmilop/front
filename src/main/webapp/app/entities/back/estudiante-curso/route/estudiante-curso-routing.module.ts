import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EstudianteCursoComponent } from '../list/estudiante-curso.component';
import { EstudianteCursoDetailComponent } from '../detail/estudiante-curso-detail.component';
import { EstudianteCursoUpdateComponent } from '../update/estudiante-curso-update.component';
import { EstudianteCursoRoutingResolveService } from './estudiante-curso-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const estudianteCursoRoute: Routes = [
  {
    path: '',
    component: EstudianteCursoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EstudianteCursoDetailComponent,
    resolve: {
      estudianteCurso: EstudianteCursoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EstudianteCursoUpdateComponent,
    resolve: {
      estudianteCurso: EstudianteCursoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EstudianteCursoUpdateComponent,
    resolve: {
      estudianteCurso: EstudianteCursoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(estudianteCursoRoute)],
  exports: [RouterModule],
})
export class EstudianteCursoRoutingModule {}
