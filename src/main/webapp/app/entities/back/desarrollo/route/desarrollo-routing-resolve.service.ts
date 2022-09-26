import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDesarrollo } from '../desarrollo.model';
import { DesarrolloService } from '../service/desarrollo.service';

@Injectable({ providedIn: 'root' })
export class DesarrolloRoutingResolveService implements Resolve<IDesarrollo | null> {
  constructor(protected service: DesarrolloService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDesarrollo | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((desarrollo: HttpResponse<IDesarrollo>) => {
          if (desarrollo.body) {
            return of(desarrollo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
