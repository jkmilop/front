import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActividadComponent } from '../list/actividad.component';
import { ActividadDetailComponent } from '../detail/actividad-detail.component';
import { ActividadUpdateComponent } from '../update/actividad-update.component';
import { ActividadRoutingResolveService } from './actividad-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const actividadRoute: Routes = [
  {
    path: '',
    component: ActividadComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActividadDetailComponent,
    resolve: {
      actividad: ActividadRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActividadUpdateComponent,
    resolve: {
      actividad: ActividadRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActividadUpdateComponent,
    resolve: {
      actividad: ActividadRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(actividadRoute)],
  exports: [RouterModule],
})
export class ActividadRoutingModule {}
