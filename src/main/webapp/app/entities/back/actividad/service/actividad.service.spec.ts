import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActividad } from '../actividad.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../actividad.test-samples';

import { ActividadService, RestActividad } from './actividad.service';

const requireRestSample: RestActividad = {
  ...sampleWithRequiredData,
  fechaInicio: sampleWithRequiredData.fechaInicio?.toJSON(),
  fechaFin: sampleWithRequiredData.fechaFin?.toJSON(),
};

describe('Actividad Service', () => {
  let service: ActividadService;
  let httpMock: HttpTestingController;
  let expectedResult: IActividad | IActividad[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActividadService);
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

    it('should create a Actividad', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const actividad = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(actividad).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Actividad', () => {
      const actividad = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(actividad).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Actividad', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Actividad', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Actividad', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActividadToCollectionIfMissing', () => {
      it('should add a Actividad to an empty array', () => {
        const actividad: IActividad = sampleWithRequiredData;
        expectedResult = service.addActividadToCollectionIfMissing([], actividad);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actividad);
      });

      it('should not add a Actividad to an array that contains it', () => {
        const actividad: IActividad = sampleWithRequiredData;
        const actividadCollection: IActividad[] = [
          {
            ...actividad,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActividadToCollectionIfMissing(actividadCollection, actividad);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Actividad to an array that doesn't contain it", () => {
        const actividad: IActividad = sampleWithRequiredData;
        const actividadCollection: IActividad[] = [sampleWithPartialData];
        expectedResult = service.addActividadToCollectionIfMissing(actividadCollection, actividad);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actividad);
      });

      it('should add only unique Actividad to an array', () => {
        const actividadArray: IActividad[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const actividadCollection: IActividad[] = [sampleWithRequiredData];
        expectedResult = service.addActividadToCollectionIfMissing(actividadCollection, ...actividadArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const actividad: IActividad = sampleWithRequiredData;
        const actividad2: IActividad = sampleWithPartialData;
        expectedResult = service.addActividadToCollectionIfMissing([], actividad, actividad2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actividad);
        expect(expectedResult).toContain(actividad2);
      });

      it('should accept null and undefined values', () => {
        const actividad: IActividad = sampleWithRequiredData;
        expectedResult = service.addActividadToCollectionIfMissing([], null, actividad, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actividad);
      });

      it('should return initial array if no Actividad is added', () => {
        const actividadCollection: IActividad[] = [sampleWithRequiredData];
        expectedResult = service.addActividadToCollectionIfMissing(actividadCollection, undefined, null);
        expect(expectedResult).toEqual(actividadCollection);
      });
    });

    describe('compareActividad', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActividad(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActividad(entity1, entity2);
        const compareResult2 = service.compareActividad(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActividad(entity1, entity2);
        const compareResult2 = service.compareActividad(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActividad(entity1, entity2);
        const compareResult2 = service.compareActividad(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
