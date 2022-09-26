import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstudianteCurso } from '../estudiante-curso.model';
import { EstudianteCursoService } from '../service/estudiante-curso.service';

@Injectable({ providedIn: 'root' })
export class EstudianteCursoRoutingResolveService implements Resolve<IEstudianteCurso | null> {
  constructor(protected service: EstudianteCursoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEstudianteCurso | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((estudianteCurso: HttpResponse<IEstudianteCurso>) => {
          if (estudianteCurso.body) {
            return of(estudianteCurso.body);
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
