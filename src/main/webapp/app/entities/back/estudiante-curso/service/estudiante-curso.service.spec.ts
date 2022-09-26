import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEstudianteCurso } from '../estudiante-curso.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../estudiante-curso.test-samples';

import { EstudianteCursoService } from './estudiante-curso.service';

const requireRestSample: IEstudianteCurso = {
  ...sampleWithRequiredData,
};

describe('EstudianteCurso Service', () => {
  let service: EstudianteCursoService;
  let httpMock: HttpTestingController;
  let expectedResult: IEstudianteCurso | IEstudianteCurso[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EstudianteCursoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a EstudianteCurso', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const estudianteCurso = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(estudianteCurso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EstudianteCurso', () => {
      const estudianteCurso = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(estudianteCurso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EstudianteCurso', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EstudianteCurso', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EstudianteCurso', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEstudianteCursoToCollectionIfMissing', () => {
      it('should add a EstudianteCurso to an empty array', () => {
        const estudianteCurso: IEstudianteCurso = sampleWithRequiredData;
        expectedResult = service.addEstudianteCursoToCollectionIfMissing([], estudianteCurso);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudianteCurso);
      });

      it('should not add a EstudianteCurso to an array that contains it', () => {
        const estudianteCurso: IEstudianteCurso = sampleWithRequiredData;
        const estudianteCursoCollection: IEstudianteCurso[] = [
          {
            ...estudianteCurso,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEstudianteCursoToCollectionIfMissing(estudianteCursoCollection, estudianteCurso);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EstudianteCurso to an array that doesn't contain it", () => {
        const estudianteCurso: IEstudianteCurso = sampleWithRequiredData;
        const estudianteCursoCollection: IEstudianteCurso[] = [sampleWithPartialData];
        expectedResult = service.addEstudianteCursoToCollectionIfMissing(estudianteCursoCollection, estudianteCurso);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudianteCurso);
      });

      it('should add only unique EstudianteCurso to an array', () => {
        const estudianteCursoArray: IEstudianteCurso[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const estudianteCursoCollection: IEstudianteCurso[] = [sampleWithRequiredData];
        expectedResult = service.addEstudianteCursoToCollectionIfMissing(estudianteCursoCollection, ...estudianteCursoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estudianteCurso: IEstudianteCurso = sampleWithRequiredData;
        const estudianteCurso2: IEstudianteCurso = sampleWithPartialData;
        expectedResult = service.addEstudianteCursoToCollectionIfMissing([], estudianteCurso, estudianteCurso2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudianteCurso);
        expect(expectedResult).toContain(estudianteCurso2);
      });

      it('should accept null and undefined values', () => {
        const estudianteCurso: IEstudianteCurso = sampleWithRequiredData;
        expectedResult = service.addEstudianteCursoToCollectionIfMissing([], null, estudianteCurso, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudianteCurso);
      });

      it('should return initial array if no EstudianteCurso is added', () => {
        const estudianteCursoCollection: IEstudianteCurso[] = [sampleWithRequiredData];
        expectedResult = service.addEstudianteCursoToCollectionIfMissing(estudianteCursoCollection, undefined, null);
        expect(expectedResult).toEqual(estudianteCursoCollection);
      });
    });

    describe('compareEstudianteCurso', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEstudianteCurso(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEstudianteCurso(entity1, entity2);
        const compareResult2 = service.compareEstudianteCurso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEstudianteCurso(entity1, entity2);
        const compareResult2 = service.compareEstudianteCurso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEstudianteCurso(entity1, entity2);
        const compareResult2 = service.compareEstudianteCurso(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
