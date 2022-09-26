import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProfesor, NewProfesor } from '../profesor.model';

export type PartialUpdateProfesor = Partial<IProfesor> & Pick<IProfesor, 'id'>;

export type EntityResponseType = HttpResponse<IProfesor>;
export type EntityArrayResponseType = HttpResponse<IProfesor[]>;

@Injectable({ providedIn: 'root' })
export class ProfesorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/profesors', 'back');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(profesor: NewProfesor): Observable<EntityResponseType> {
    return this.http.post<IProfesor>(this.resourceUrl, profesor, { observe: 'response' });
  }

  update(profesor: IProfesor): Observable<EntityResponseType> {
    return this.http.put<IProfesor>(`${this.resourceUrl}/${this.getProfesorIdentifier(profesor)}`, profesor, { observe: 'response' });
  }

  partialUpdate(profesor: PartialUpdateProfesor): Observable<EntityResponseType> {
    return this.http.patch<IProfesor>(`${this.resourceUrl}/${this.getProfesorIdentifier(profesor)}`, profesor, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProfesor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProfesor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProfesorIdentifier(profesor: Pick<IProfesor, 'id'>): number {
    return profesor.id;
  }

  compareProfesor(o1: Pick<IProfesor, 'id'> | null, o2: Pick<IProfesor, 'id'> | null): boolean {
    return o1 && o2 ? this.getProfesorIdentifier(o1) === this.getProfesorIdentifier(o2) : o1 === o2;
  }

  addProfesorToCollectionIfMissing<Type extends Pick<IProfesor, 'id'>>(
    profesorCollection: Type[],
    ...profesorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const profesors: Type[] = profesorsToCheck.filter(isPresent);
    if (profesors.length > 0) {
      const profesorCollectionIdentifiers = profesorCollection.map(profesorItem => this.getProfesorIdentifier(profesorItem)!);
      const profesorsToAdd = profesors.filter(profesorItem => {
        const profesorIdentifier = this.getProfesorIdentifier(profesorItem);
        if (profesorCollectionIdentifiers.includes(profesorIdentifier)) {
          return false;
        }
        profesorCollectionIdentifiers.push(profesorIdentifier);
        return true;
      });
      return [...profesorsToAdd, ...profesorCollection];
    }
    return profesorCollection;
  }
}
