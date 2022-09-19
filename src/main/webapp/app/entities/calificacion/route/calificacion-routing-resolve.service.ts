import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICalificacion } from '../calificacion.model';
import { CalificacionService } from '../service/calificacion.service';

@Injectable({ providedIn: 'root' })
export class CalificacionRoutingResolveService implements Resolve<ICalificacion | null> {
  constructor(protected service: CalificacionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICalificacion | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((calificacion: HttpResponse<ICalificacion>) => {
          if (calificacion.body) {
            return of(calificacion.body);
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
