import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../desarrollo.test-samples';

import { DesarrolloFormService } from './desarrollo-form.service';

describe('Desarrollo Form Service', () => {
  let service: DesarrolloFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesarrolloFormService);
  });

  describe('Service methods', () => {
    describe('createDesarrolloFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDesarrolloFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            terminado: expect.any(Object),
            nota: expect.any(Object),
            estudiante: expect.any(Object),
            actividad: expect.any(Object),
          })
        );
      });

      it('passing IDesarrollo should create a new form with FormGroup', () => {
        const formGroup = service.createDesarrolloFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            terminado: expect.any(Object),
            nota: expect.any(Object),
            estudiante: expect.any(Object),
            actividad: expect.any(Object),
          })
        );
      });
    });

    describe('getDesarrollo', () => {
      it('should return NewDesarrollo for default Desarrollo initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDesarrolloFormGroup(sampleWithNewData);

        const desarrollo = service.getDesarrollo(formGroup) as any;

        expect(desarrollo).toMatchObject(sampleWithNewData);
      });

      it('should return NewDesarrollo for empty Desarrollo initial value', () => {
        const formGroup = service.createDesarrolloFormGroup();

        const desarrollo = service.getDesarrollo(formGroup) as any;

        expect(desarrollo).toMatchObject({});
      });

      it('should return IDesarrollo', () => {
        const formGroup = service.createDesarrolloFormGroup(sampleWithRequiredData);

        const desarrollo = service.getDesarrollo(formGroup) as any;

        expect(desarrollo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDesarrollo should not enable id FormControl', () => {
        const formGroup = service.createDesarrolloFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDesarrollo should disable id FormControl', () => {
        const formGroup = service.createDesarrolloFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
