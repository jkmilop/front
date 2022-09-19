import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMatricula, NewMatricula } from '../matricula.model';

export type PartialUpdateMatricula = Partial<IMatricula> & Pick<IMatricula, 'id'>;

export type EntityResponseType = HttpResponse<IMatricula>;
export type EntityArrayResponseType = HttpResponse<IMatricula[]>;

@Injectable({ providedIn: 'root' })
export class MatriculaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/matriculas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(matricula: NewMatricula): Observable<EntityResponseType> {
    return this.http.post<IMatricula>(this.resourceUrl, matricula, { observe: 'response' });
  }

  update(matricula: IMatricula): Observable<EntityResponseType> {
    return this.http.put<IMatricula>(`${this.resourceUrl}/${this.getMatriculaIdentifier(matricula)}`, matricula, { observe: 'response' });
  }

  partialUpdate(matricula: PartialUpdateMatricula): Observable<EntityResponseType> {
    return this.http.patch<IMatricula>(`${this.resourceUrl}/${this.getMatriculaIdentifier(matricula)}`, matricula, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMatricula>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMatricula[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMatriculaIdentifier(matricula: Pick<IMatricula, 'id'>): number {
    return matricula.id;
  }

  compareMatricula(o1: Pick<IMatricula, 'id'> | null, o2: Pick<IMatricula, 'id'> | null): boolean {
    return o1 && o2 ? this.getMatriculaIdentifier(o1) === this.getMatriculaIdentifier(o2) : o1 === o2;
  }

  addMatriculaToCollectionIfMissing<Type extends Pick<IMatricula, 'id'>>(
    matriculaCollection: Type[],
    ...matriculasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const matriculas: Type[] = matriculasToCheck.filter(isPresent);
    if (matriculas.length > 0) {
      const matriculaCollectionIdentifiers = matriculaCollection.map(matriculaItem => this.getMatriculaIdentifier(matriculaItem)!);
      const matriculasToAdd = matriculas.filter(matriculaItem => {
        const matriculaIdentifier = this.getMatriculaIdentifier(matriculaItem);
        if (matriculaCollectionIdentifiers.includes(matriculaIdentifier)) {
          return false;
        }
        matriculaCollectionIdentifiers.push(matriculaIdentifier);
        return true;
      });
      return [...matriculasToAdd, ...matriculaCollection];
    }
    return matriculaCollection;
  }
}
