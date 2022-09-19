import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstudiante, NewEstudiante } from '../estudiante.model';

export type PartialUpdateEstudiante = Partial<IEstudiante> & Pick<IEstudiante, 'id'>;

export type EntityResponseType = HttpResponse<IEstudiante>;
export type EntityArrayResponseType = HttpResponse<IEstudiante[]>;

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estudiantes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(estudiante: NewEstudiante): Observable<EntityResponseType> {
    return this.http.post<IEstudiante>(this.resourceUrl, estudiante, { observe: 'response' });
  }

  update(estudiante: IEstudiante): Observable<EntityResponseType> {
    return this.http.put<IEstudiante>(`${this.resourceUrl}/${this.getEstudianteIdentifier(estudiante)}`, estudiante, {
      observe: 'response',
    });
  }

  partialUpdate(estudiante: PartialUpdateEstudiante): Observable<EntityResponseType> {
    return this.http.patch<IEstudiante>(`${this.resourceUrl}/${this.getEstudianteIdentifier(estudiante)}`, estudiante, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEstudiante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstudiante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEstudianteIdentifier(estudiante: Pick<IEstudiante, 'id'>): number {
    return estudiante.id;
  }

  compareEstudiante(o1: Pick<IEstudiante, 'id'> | null, o2: Pick<IEstudiante, 'id'> | null): boolean {
    return o1 && o2 ? this.getEstudianteIdentifier(o1) === this.getEstudianteIdentifier(o2) : o1 === o2;
  }

  addEstudianteToCollectionIfMissing<Type extends Pick<IEstudiante, 'id'>>(
    estudianteCollection: Type[],
    ...estudiantesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const estudiantes: Type[] = estudiantesToCheck.filter(isPresent);
    if (estudiantes.length > 0) {
      const estudianteCollectionIdentifiers = estudianteCollection.map(estudianteItem => this.getEstudianteIdentifier(estudianteItem)!);
      const estudiantesToAdd = estudiantes.filter(estudianteItem => {
        const estudianteIdentifier = this.getEstudianteIdentifier(estudianteItem);
        if (estudianteCollectionIdentifiers.includes(estudianteIdentifier)) {
          return false;
        }
        estudianteCollectionIdentifiers.push(estudianteIdentifier);
        return true;
      });
      return [...estudiantesToAdd, ...estudianteCollection];
    }
    return estudianteCollection;
  }
}
