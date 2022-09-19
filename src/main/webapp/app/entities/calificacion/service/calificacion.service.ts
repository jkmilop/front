import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICalificacion, NewCalificacion } from '../calificacion.model';

export type PartialUpdateCalificacion = Partial<ICalificacion> & Pick<ICalificacion, 'id'>;

export type EntityResponseType = HttpResponse<ICalificacion>;
export type EntityArrayResponseType = HttpResponse<ICalificacion[]>;

@Injectable({ providedIn: 'root' })
export class CalificacionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/calificacions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(calificacion: NewCalificacion): Observable<EntityResponseType> {
    return this.http.post<ICalificacion>(this.resourceUrl, calificacion, { observe: 'response' });
  }

  update(calificacion: ICalificacion): Observable<EntityResponseType> {
    return this.http.put<ICalificacion>(`${this.resourceUrl}/${this.getCalificacionIdentifier(calificacion)}`, calificacion, {
      observe: 'response',
    });
  }

  partialUpdate(calificacion: PartialUpdateCalificacion): Observable<EntityResponseType> {
    return this.http.patch<ICalificacion>(`${this.resourceUrl}/${this.getCalificacionIdentifier(calificacion)}`, calificacion, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICalificacion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICalificacion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCalificacionIdentifier(calificacion: Pick<ICalificacion, 'id'>): number {
    return calificacion.id;
  }

  compareCalificacion(o1: Pick<ICalificacion, 'id'> | null, o2: Pick<ICalificacion, 'id'> | null): boolean {
    return o1 && o2 ? this.getCalificacionIdentifier(o1) === this.getCalificacionIdentifier(o2) : o1 === o2;
  }

  addCalificacionToCollectionIfMissing<Type extends Pick<ICalificacion, 'id'>>(
    calificacionCollection: Type[],
    ...calificacionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const calificacions: Type[] = calificacionsToCheck.filter(isPresent);
    if (calificacions.length > 0) {
      const calificacionCollectionIdentifiers = calificacionCollection.map(
        calificacionItem => this.getCalificacionIdentifier(calificacionItem)!
      );
      const calificacionsToAdd = calificacions.filter(calificacionItem => {
        const calificacionIdentifier = this.getCalificacionIdentifier(calificacionItem);
        if (calificacionCollectionIdentifiers.includes(calificacionIdentifier)) {
          return false;
        }
        calificacionCollectionIdentifiers.push(calificacionIdentifier);
        return true;
      });
      return [...calificacionsToAdd, ...calificacionCollection];
    }
    return calificacionCollection;
  }
}
