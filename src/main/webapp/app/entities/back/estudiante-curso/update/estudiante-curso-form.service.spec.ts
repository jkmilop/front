import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../estudiante-curso.test-samples';

import { EstudianteCursoFormService } from './estudiante-curso-form.service';

describe('EstudianteCurso Form Service', () => {
  let service: EstudianteCursoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstudianteCursoFormService);
  });

  describe('Service methods', () => {
    describe('createEstudianteCursoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEstudianteCursoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            curso: expect.any(Object),
            estudiante: expect.any(Object),
          })
        );
      });

      it('passing IEstudianteCurso should create a new form with FormGroup', () => {
        const formGroup = service.createEstudianteCursoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            curso: expect.any(Object),
            estudiante: expect.any(Object),
          })
        );
      });
    });

    describe('getEstudianteCurso', () => {
      it('should return NewEstudianteCurso for default EstudianteCurso initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEstudianteCursoFormGroup(sampleWithNewData);

        const estudianteCurso = service.getEstudianteCurso(formGroup) as any;

        expect(estudianteCurso).toMatchObject(sampleWithNewData);
      });

      it('should return NewEstudianteCurso for empty EstudianteCurso initial value', () => {
        const formGroup = service.createEstudianteCursoFormGroup();

        const estudianteCurso = service.getEstudianteCurso(formGroup) as any;

        expect(estudianteCurso).toMatchObject({});
      });

      it('should return IEstudianteCurso', () => {
        const formGroup = service.createEstudianteCursoFormGroup(sampleWithRequiredData);

        const estudianteCurso = service.getEstudianteCurso(formGroup) as any;

        expect(estudianteCurso).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEstudianteCurso should not enable id FormControl', () => {
        const formGroup = service.createEstudianteCursoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEstudianteCurso should disable id FormControl', () => {
        const formGroup = service.createEstudianteCursoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
