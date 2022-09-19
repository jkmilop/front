import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../calificacion.test-samples';

import { CalificacionFormService } from './calificacion-form.service';

describe('Calificacion Form Service', () => {
  let service: CalificacionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalificacionFormService);
  });

  describe('Service methods', () => {
    describe('createCalificacionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCalificacionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nota: expect.any(Object),
            actividad: expect.any(Object),
            estudiante: expect.any(Object),
          })
        );
      });

      it('passing ICalificacion should create a new form with FormGroup', () => {
        const formGroup = service.createCalificacionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nota: expect.any(Object),
            actividad: expect.any(Object),
            estudiante: expect.any(Object),
          })
        );
      });
    });

    describe('getCalificacion', () => {
      it('should return NewCalificacion for default Calificacion initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCalificacionFormGroup(sampleWithNewData);

        const calificacion = service.getCalificacion(formGroup) as any;

        expect(calificacion).toMatchObject(sampleWithNewData);
      });

      it('should return NewCalificacion for empty Calificacion initial value', () => {
        const formGroup = service.createCalificacionFormGroup();

        const calificacion = service.getCalificacion(formGroup) as any;

        expect(calificacion).toMatchObject({});
      });

      it('should return ICalificacion', () => {
        const formGroup = service.createCalificacionFormGroup(sampleWithRequiredData);

        const calificacion = service.getCalificacion(formGroup) as any;

        expect(calificacion).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICalificacion should not enable id FormControl', () => {
        const formGroup = service.createCalificacionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCalificacion should disable id FormControl', () => {
        const formGroup = service.createCalificacionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
