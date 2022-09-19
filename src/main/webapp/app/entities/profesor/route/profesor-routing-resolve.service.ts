import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProfesor } from '../profesor.model';
import { ProfesorService } from '../service/profesor.service';

@Injectable({ providedIn: 'root' })
export class ProfesorRoutingResolveService implements Resolve<IProfesor | null> {
  constructor(protected service: ProfesorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProfesor | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((profesor: HttpResponse<IProfesor>) => {
          if (profesor.body) {
            return of(profesor.body);
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
