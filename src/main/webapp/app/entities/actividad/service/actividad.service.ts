import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActividad, NewActividad } from '../actividad.model';

export type PartialUpdateActividad = Partial<IActividad> & Pick<IActividad, 'id'>;

export type EntityResponseType = HttpResponse<IActividad>;
export type EntityArrayResponseType = HttpResponse<IActividad[]>;

@Injectable({ providedIn: 'root' })
export class ActividadService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/actividads');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(actividad: NewActividad): Observable<EntityResponseType> {
    return this.http.post<IActividad>(this.resourceUrl, actividad, { observe: 'response' });
  }

  update(actividad: IActividad): Observable<EntityResponseType> {
    return this.http.put<IActividad>(`${this.resourceUrl}/${this.getActividadIdentifier(actividad)}`, actividad, { observe: 'response' });
  }

  partialUpdate(actividad: PartialUpdateActividad): Observable<EntityResponseType> {
    return this.http.patch<IActividad>(`${this.resourceUrl}/${this.getActividadIdentifier(actividad)}`, actividad, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActividad>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActividad[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActividadIdentifier(actividad: Pick<IActividad, 'id'>): number {
    return actividad.id;
  }

  compareActividad(o1: Pick<IActividad, 'id'> | null, o2: Pick<IActividad, 'id'> | null): boolean {
    return o1 && o2 ? this.getActividadIdentifier(o1) === this.getActividadIdentifier(o2) : o1 === o2;
  }

  addActividadToCollectionIfMissing<Type extends Pick<IActividad, 'id'>>(
    actividadCollection: Type[],
    ...actividadsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const actividads: Type[] = actividadsToCheck.filter(isPresent);
    if (actividads.length > 0) {
      const actividadCollectionIdentifiers = actividadCollection.map(actividadItem => this.getActividadIdentifier(actividadItem)!);
      const actividadsToAdd = actividads.filter(actividadItem => {
        const actividadIdentifier = this.getActividadIdentifier(actividadItem);
        if (actividadCollectionIdentifiers.includes(actividadIdentifier)) {
          return false;
        }
        actividadCollectionIdentifiers.push(actividadIdentifier);
        return true;
      });
      return [...actividadsToAdd, ...actividadCollection];
    }
    return actividadCollection;
  }
}
