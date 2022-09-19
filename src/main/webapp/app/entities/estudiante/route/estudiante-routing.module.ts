import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EstudianteComponent } from '../list/estudiante.component';
import { EstudianteDetailComponent } from '../detail/estudiante-detail.component';
import { EstudianteUpdateComponent } from '../update/estudiante-update.component';
import { EstudianteRoutingResolveService } from './estudiante-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const estudianteRoute: Routes = [
  {
    path: '',
    component: EstudianteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EstudianteDetailComponent,
    resolve: {
      estudiante: EstudianteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EstudianteUpdateComponent,
    resolve: {
      estudiante: EstudianteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EstudianteUpdateComponent,
    resolve: {
      estudiante: EstudianteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(estudianteRoute)],
  exports: [RouterModule],
})
export class EstudianteRoutingModule {}
