import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../actividad.test-samples';

import { ActividadFormService } from './actividad-form.service';

describe('Actividad Form Service', () => {
  let service: ActividadFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadFormService);
  });

  describe('Service methods', () => {
    describe('createActividadFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActividadFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            actividadName: expect.any(Object),
            description: expect.any(Object),
            fechaInicio: expect.any(Object),
            fechaFin: expect.any(Object),
            formato: expect.any(Object),
            curso: expect.any(Object),
          })
        );
      });

      it('passing IActividad should create a new form with FormGroup', () => {
        const formGroup = service.createActividadFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            actividadName: expect.any(Object),
            description: expect.any(Object),
            fechaInicio: expect.any(Object),
            fechaFin: expect.any(Object),
            formato: expect.any(Object),
            curso: expect.any(Object),
          })
        );
      });
    });

    describe('getActividad', () => {
      it('should return NewActividad for default Actividad initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActividadFormGroup(sampleWithNewData);

        const actividad = service.getActividad(formGroup) as any;

        expect(actividad).toMatchObject(sampleWithNewData);
      });

      it('should return NewActividad for empty Actividad initial value', () => {
        const formGroup = service.createActividadFormGroup();

        const actividad = service.getActividad(formGroup) as any;

        expect(actividad).toMatchObject({});
      });

      it('should return IActividad', () => {
        const formGroup = service.createActividadFormGroup(sampleWithRequiredData);

        const actividad = service.getActividad(formGroup) as any;

        expect(actividad).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActividad should not enable id FormControl', () => {
        const formGroup = service.createActividadFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActividad should disable id FormControl', () => {
        const formGroup = service.createActividadFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
