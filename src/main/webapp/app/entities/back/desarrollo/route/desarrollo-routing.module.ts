import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DesarrolloComponent } from '../list/desarrollo.component';
import { DesarrolloDetailComponent } from '../detail/desarrollo-detail.component';
import { DesarrolloUpdateComponent } from '../update/desarrollo-update.component';
import { DesarrolloRoutingResolveService } from './desarrollo-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const desarrolloRoute: Routes = [
  {
    path: '',
    component: DesarrolloComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DesarrolloDetailComponent,
    resolve: {
      desarrollo: DesarrolloRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DesarrolloUpdateComponent,
    resolve: {
      desarrollo: DesarrolloRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DesarrolloUpdateComponent,
    resolve: {
      desarrollo: DesarrolloRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(desarrolloRoute)],
  exports: [RouterModule],
})
export class DesarrolloRoutingModule {}
