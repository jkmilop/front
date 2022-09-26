import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDesarrollo, NewDesarrollo } from '../desarrollo.model';

export type PartialUpdateDesarrollo = Partial<IDesarrollo> & Pick<IDesarrollo, 'id'>;

export type EntityResponseType = HttpResponse<IDesarrollo>;
export type EntityArrayResponseType = HttpResponse<IDesarrollo[]>;

@Injectable({ providedIn: 'root' })
export class DesarrolloService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/desarrollos', 'back');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(desarrollo: NewDesarrollo): Observable<EntityResponseType> {
    return this.http.post<IDesarrollo>(this.resourceUrl, desarrollo, { observe: 'response' });
  }

  update(desarrollo: IDesarrollo): Observable<EntityResponseType> {
    return this.http.put<IDesarrollo>(`${this.resourceUrl}/${this.getDesarrolloIdentifier(desarrollo)}`, desarrollo, {
      observe: 'response',
    });
  }

  partialUpdate(desarrollo: PartialUpdateDesarrollo): Observable<EntityResponseType> {
    return this.http.patch<IDesarrollo>(`${this.resourceUrl}/${this.getDesarrolloIdentifier(desarrollo)}`, desarrollo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDesarrollo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDesarrollo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDesarrolloIdentifier(desarrollo: Pick<IDesarrollo, 'id'>): number {
    return desarrollo.id;
  }

  compareDesarrollo(o1: Pick<IDesarrollo, 'id'> | null, o2: Pick<IDesarrollo, 'id'> | null): boolean {
    return o1 && o2 ? this.getDesarrolloIdentifier(o1) === this.getDesarrolloIdentifier(o2) : o1 === o2;
  }

  addDesarrolloToCollectionIfMissing<Type extends Pick<IDesarrollo, 'id'>>(
    desarrolloCollection: Type[],
    ...desarrollosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const desarrollos: Type[] = desarrollosToCheck.filter(isPresent);
    if (desarrollos.length > 0) {
      const desarrolloCollectionIdentifiers = desarrolloCollection.map(desarrolloItem => this.getDesarrolloIdentifier(desarrolloItem)!);
      const desarrollosToAdd = desarrollos.filter(desarrolloItem => {
        const desarrolloIdentifier = this.getDesarrolloIdentifier(desarrolloItem);
        if (desarrolloCollectionIdentifiers.includes(desarrolloIdentifier)) {
          return false;
        }
        desarrolloCollectionIdentifiers.push(desarrolloIdentifier);
        return true;
      });
      return [...desarrollosToAdd, ...desarrolloCollection];
    }
    return desarrolloCollection;
  }
}
