import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDesarrollo } from '../desarrollo.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../desarrollo.test-samples';

import { DesarrolloService } from './desarrollo.service';

const requireRestSample: IDesarrollo = {
  ...sampleWithRequiredData,
};

describe('Desarrollo Service', () => {
  let service: DesarrolloService;
  let httpMock: HttpTestingController;
  let expectedResult: IDesarrollo | IDesarrollo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DesarrolloService);
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

    it('should create a Desarrollo', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const desarrollo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(desarrollo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Desarrollo', () => {
      const desarrollo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(desarrollo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Desarrollo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Desarrollo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Desarrollo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDesarrolloToCollectionIfMissing', () => {
      it('should add a Desarrollo to an empty array', () => {
        const desarrollo: IDesarrollo = sampleWithRequiredData;
        expectedResult = service.addDesarrolloToCollectionIfMissing([], desarrollo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(desarrollo);
      });

      it('should not add a Desarrollo to an array that contains it', () => {
        const desarrollo: IDesarrollo = sampleWithRequiredData;
        const desarrolloCollection: IDesarrollo[] = [
          {
            ...desarrollo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDesarrolloToCollectionIfMissing(desarrolloCollection, desarrollo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Desarrollo to an array that doesn't contain it", () => {
        const desarrollo: IDesarrollo = sampleWithRequiredData;
        const desarrolloCollection: IDesarrollo[] = [sampleWithPartialData];
        expectedResult = service.addDesarrolloToCollectionIfMissing(desarrolloCollection, desarrollo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(desarrollo);
      });

      it('should add only unique Desarrollo to an array', () => {
        const desarrolloArray: IDesarrollo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const desarrolloCollection: IDesarrollo[] = [sampleWithRequiredData];
        expectedResult = service.addDesarrolloToCollectionIfMissing(desarrolloCollection, ...desarrolloArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const desarrollo: IDesarrollo = sampleWithRequiredData;
        const desarrollo2: IDesarrollo = sampleWithPartialData;
        expectedResult = service.addDesarrolloToCollectionIfMissing([], desarrollo, desarrollo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(desarrollo);
        expect(expectedResult).toContain(desarrollo2);
      });

      it('should accept null and undefined values', () => {
        const desarrollo: IDesarrollo = sampleWithRequiredData;
        expectedResult = service.addDesarrolloToCollectionIfMissing([], null, desarrollo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(desarrollo);
      });

      it('should return initial array if no Desarrollo is added', () => {
        const desarrolloCollection: IDesarrollo[] = [sampleWithRequiredData];
        expectedResult = service.addDesarrolloToCollectionIfMissing(desarrolloCollection, undefined, null);
        expect(expectedResult).toEqual(desarrolloCollection);
      });
    });

    describe('compareDesarrollo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDesarrollo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDesarrollo(entity1, entity2);
        const compareResult2 = service.compareDesarrollo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDesarrollo(entity1, entity2);
        const compareResult2 = service.compareDesarrollo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDesarrollo(entity1, entity2);
        const compareResult2 = service.compareDesarrollo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
