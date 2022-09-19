import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../profesor.test-samples';

import { ProfesorFormService } from './profesor-form.service';

describe('Profesor Form Service', () => {
  let service: ProfesorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesorFormService);
  });

  describe('Service methods', () => {
    describe('createProfesorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProfesorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            apellido: expect.any(Object),
            correo: expect.any(Object),
          })
        );
      });

      it('passing IProfesor should create a new form with FormGroup', () => {
        const formGroup = service.createProfesorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            apellido: expect.any(Object),
            correo: expect.any(Object),
          })
        );
      });
    });

    describe('getProfesor', () => {
      it('should return NewProfesor for default Profesor initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProfesorFormGroup(sampleWithNewData);

        const profesor = service.getProfesor(formGroup) as any;

        expect(profesor).toMatchObject(sampleWithNewData);
      });

      it('should return NewProfesor for empty Profesor initial value', () => {
        const formGroup = service.createProfesorFormGroup();

        const profesor = service.getProfesor(formGroup) as any;

        expect(profesor).toMatchObject({});
      });

      it('should return IProfesor', () => {
        const formGroup = service.createProfesorFormGroup(sampleWithRequiredData);

        const profesor = service.getProfesor(formGroup) as any;

        expect(profesor).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProfesor should not enable id FormControl', () => {
        const formGroup = service.createProfesorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProfesor should disable id FormControl', () => {
        const formGroup = service.createProfesorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
