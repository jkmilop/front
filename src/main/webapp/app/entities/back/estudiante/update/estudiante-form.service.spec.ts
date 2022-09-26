import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../estudiante.test-samples';

import { EstudianteFormService } from './estudiante-form.service';

describe('Estudiante Form Service', () => {
  let service: EstudianteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstudianteFormService);
  });

  describe('Service methods', () => {
    describe('createEstudianteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEstudianteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            estudianteName: expect.any(Object),
            codigoEstudiante: expect.any(Object),
            correo: expect.any(Object),
          })
        );
      });

      it('passing IEstudiante should create a new form with FormGroup', () => {
        const formGroup = service.createEstudianteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            estudianteName: expect.any(Object),
            codigoEstudiante: expect.any(Object),
            correo: expect.any(Object),
          })
        );
      });
    });

    describe('getEstudiante', () => {
      it('should return NewEstudiante for default Estudiante initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEstudianteFormGroup(sampleWithNewData);

        const estudiante = service.getEstudiante(formGroup) as any;

        expect(estudiante).toMatchObject(sampleWithNewData);
      });

      it('should return NewEstudiante for empty Estudiante initial value', () => {
        const formGroup = service.createEstudianteFormGroup();

        const estudiante = service.getEstudiante(formGroup) as any;

        expect(estudiante).toMatchObject({});
      });

      it('should return IEstudiante', () => {
        const formGroup = service.createEstudianteFormGroup(sampleWithRequiredData);

        const estudiante = service.getEstudiante(formGroup) as any;

        expect(estudiante).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEstudiante should not enable id FormControl', () => {
        const formGroup = service.createEstudianteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEstudiante should disable id FormControl', () => {
        const formGroup = service.createEstudianteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
