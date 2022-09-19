import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMatricula } from '../matricula.model';
import { MatriculaService } from '../service/matricula.service';

@Injectable({ providedIn: 'root' })
export class MatriculaRoutingResolveService implements Resolve<IMatricula | null> {
  constructor(protected service: MatriculaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMatricula | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((matricula: HttpResponse<IMatricula>) => {
          if (matricula.body) {
            return of(matricula.body);
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
