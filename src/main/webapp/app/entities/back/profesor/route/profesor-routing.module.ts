import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProfesorComponent } from '../list/profesor.component';
import { ProfesorDetailComponent } from '../detail/profesor-detail.component';
import { ProfesorUpdateComponent } from '../update/profesor-update.component';
import { ProfesorRoutingResolveService } from './profesor-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const profesorRoute: Routes = [
  {
    path: '',
    component: ProfesorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProfesorDetailComponent,
    resolve: {
      profesor: ProfesorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProfesorUpdateComponent,
    resolve: {
      profesor: ProfesorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProfesorUpdateComponent,
    resolve: {
      profesor: ProfesorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(profesorRoute)],
  exports: [RouterModule],
})
export class ProfesorRoutingModule {}
