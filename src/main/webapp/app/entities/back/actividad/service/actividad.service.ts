import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActividad, NewActividad } from '../actividad.model';

export type PartialUpdateActividad = Partial<IActividad> & Pick<IActividad, 'id'>;

type RestOf<T extends IActividad | NewActividad> = Omit<T, 'fechaInicio' | 'fechaFin'> & {
  fechaInicio?: string | null;
  fechaFin?: string | null;
};

export type RestActividad = RestOf<IActividad>;

export type NewRestActividad = RestOf<NewActividad>;

export type PartialUpdateRestActividad = RestOf<PartialUpdateActividad>;

export type EntityResponseType = HttpResponse<IActividad>;
export type EntityArrayResponseType = HttpResponse<IActividad[]>;

@Injectable({ providedIn: 'root' })
export class ActividadService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/actividads', 'back');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(actividad: NewActividad): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actividad);
    return this.http
      .post<RestActividad>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(actividad: IActividad): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actividad);
    return this.http
      .put<RestActividad>(`${this.resourceUrl}/${this.getActividadIdentifier(actividad)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(actividad: PartialUpdateActividad): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actividad);
    return this.http
      .patch<RestActividad>(`${this.resourceUrl}/${this.getActividadIdentifier(actividad)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestActividad>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestActividad[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
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

  protected convertDateFromClient<T extends IActividad | NewActividad | PartialUpdateActividad>(actividad: T): RestOf<T> {
    return {
      ...actividad,
      fechaInicio: actividad.fechaInicio?.toJSON() ?? null,
      fechaFin: actividad.fechaFin?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restActividad: RestActividad): IActividad {
    return {
      ...restActividad,
      fechaInicio: restActividad.fechaInicio ? dayjs(restActividad.fechaInicio) : undefined,
      fechaFin: restActividad.fechaFin ? dayjs(restActividad.fechaFin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestActividad>): HttpResponse<IActividad> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestActividad[]>): HttpResponse<IActividad[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
