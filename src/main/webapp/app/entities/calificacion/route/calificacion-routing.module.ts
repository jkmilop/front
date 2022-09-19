import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CalificacionComponent } from '../list/calificacion.component';
import { CalificacionDetailComponent } from '../detail/calificacion-detail.component';
import { CalificacionUpdateComponent } from '../update/calificacion-update.component';
import { CalificacionRoutingResolveService } from './calificacion-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const calificacionRoute: Routes = [
  {
    path: '',
    component: CalificacionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CalificacionDetailComponent,
    resolve: {
      calificacion: CalificacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CalificacionUpdateComponent,
    resolve: {
      calificacion: CalificacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CalificacionUpdateComponent,
    resolve: {
      calificacion: CalificacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(calificacionRoute)],
  exports: [RouterModule],
})
export class CalificacionRoutingModule {}
