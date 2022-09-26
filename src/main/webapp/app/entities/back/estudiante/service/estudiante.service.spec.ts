import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEstudiante } from '../estudiante.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../estudiante.test-samples';

import { EstudianteService } from './estudiante.service';

const requireRestSample: IEstudiante = {
  ...sampleWithRequiredData,
};

describe('Estudiante Service', () => {
  let service: EstudianteService;
  let httpMock: HttpTestingController;
  let expectedResult: IEstudiante | IEstudiante[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EstudianteService);
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

    it('should create a Estudiante', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const estudiante = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(estudiante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Estudiante', () => {
      const estudiante = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(estudiante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Estudiante', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Estudiante', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Estudiante', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEstudianteToCollectionIfMissing', () => {
      it('should add a Estudiante to an empty array', () => {
        const estudiante: IEstudiante = sampleWithRequiredData;
        expectedResult = service.addEstudianteToCollectionIfMissing([], estudiante);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudiante);
      });

      it('should not add a Estudiante to an array that contains it', () => {
        const estudiante: IEstudiante = sampleWithRequiredData;
        const estudianteCollection: IEstudiante[] = [
          {
            ...estudiante,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEstudianteToCollectionIfMissing(estudianteCollection, estudiante);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Estudiante to an array that doesn't contain it", () => {
        const estudiante: IEstudiante = sampleWithRequiredData;
        const estudianteCollection: IEstudiante[] = [sampleWithPartialData];
        expectedResult = service.addEstudianteToCollectionIfMissing(estudianteCollection, estudiante);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudiante);
      });

      it('should add only unique Estudiante to an array', () => {
        const estudianteArray: IEstudiante[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const estudianteCollection: IEstudiante[] = [sampleWithRequiredData];
        expectedResult = service.addEstudianteToCollectionIfMissing(estudianteCollection, ...estudianteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estudiante: IEstudiante = sampleWithRequiredData;
        const estudiante2: IEstudiante = sampleWithPartialData;
        expectedResult = service.addEstudianteToCollectionIfMissing([], estudiante, estudiante2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudiante);
        expect(expectedResult).toContain(estudiante2);
      });

      it('should accept null and undefined values', () => {
        const estudiante: IEstudiante = sampleWithRequiredData;
        expectedResult = service.addEstudianteToCollectionIfMissing([], null, estudiante, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudiante);
      });

      it('should return initial array if no Estudiante is added', () => {
        const estudianteCollection: IEstudiante[] = [sampleWithRequiredData];
        expectedResult = service.addEstudianteToCollectionIfMissing(estudianteCollection, undefined, null);
        expect(expectedResult).toEqual(estudianteCollection);
      });
    });

    describe('compareEstudiante', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEstudiante(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEstudiante(entity1, entity2);
        const compareResult2 = service.compareEstudiante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEstudiante(entity1, entity2);
        const compareResult2 = service.compareEstudiante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEstudiante(entity1, entity2);
        const compareResult2 = service.compareEstudiante(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
