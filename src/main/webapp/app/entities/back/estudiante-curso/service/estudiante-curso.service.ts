import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstudianteCurso, NewEstudianteCurso } from '../estudiante-curso.model';

export type PartialUpdateEstudianteCurso = Partial<IEstudianteCurso> & Pick<IEstudianteCurso, 'id'>;

export type EntityResponseType = HttpResponse<IEstudianteCurso>;
export type EntityArrayResponseType = HttpResponse<IEstudianteCurso[]>;

@Injectable({ providedIn: 'root' })
export class EstudianteCursoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estudiante-cursos', 'back');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(estudianteCurso: NewEstudianteCurso): Observable<EntityResponseType> {
    return this.http.post<IEstudianteCurso>(this.resourceUrl, estudianteCurso, { observe: 'response' });
  }

  update(estudianteCurso: IEstudianteCurso): Observable<EntityResponseType> {
    return this.http.put<IEstudianteCurso>(`${this.resourceUrl}/${this.getEstudianteCursoIdentifier(estudianteCurso)}`, estudianteCurso, {
      observe: 'response',
    });
  }

  partialUpdate(estudianteCurso: PartialUpdateEstudianteCurso): Observable<EntityResponseType> {
    return this.http.patch<IEstudianteCurso>(`${this.resourceUrl}/${this.getEstudianteCursoIdentifier(estudianteCurso)}`, estudianteCurso, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEstudianteCurso>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstudianteCurso[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEstudianteCursoIdentifier(estudianteCurso: Pick<IEstudianteCurso, 'id'>): number {
    return estudianteCurso.id;
  }

  compareEstudianteCurso(o1: Pick<IEstudianteCurso, 'id'> | null, o2: Pick<IEstudianteCurso, 'id'> | null): boolean {
    return o1 && o2 ? this.getEstudianteCursoIdentifier(o1) === this.getEstudianteCursoIdentifier(o2) : o1 === o2;
  }

  addEstudianteCursoToCollectionIfMissing<Type extends Pick<IEstudianteCurso, 'id'>>(
    estudianteCursoCollection: Type[],
    ...estudianteCursosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const estudianteCursos: Type[] = estudianteCursosToCheck.filter(isPresent);
    if (estudianteCursos.length > 0) {
      const estudianteCursoCollectionIdentifiers = estudianteCursoCollection.map(
        estudianteCursoItem => this.getEstudianteCursoIdentifier(estudianteCursoItem)!
      );
      const estudianteCursosToAdd = estudianteCursos.filter(estudianteCursoItem => {
        const estudianteCursoIdentifier = this.getEstudianteCursoIdentifier(estudianteCursoItem);
        if (estudianteCursoCollectionIdentifiers.includes(estudianteCursoIdentifier)) {
          return false;
        }
        estudianteCursoCollectionIdentifiers.push(estudianteCursoIdentifier);
        return true;
      });
      return [...estudianteCursosToAdd, ...estudianteCursoCollection];
    }
    return estudianteCursoCollection;
  }
}
