import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../matricula.test-samples';

import { MatriculaFormService } from './matricula-form.service';

describe('Matricula Form Service', () => {
  let service: MatriculaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatriculaFormService);
  });

  describe('Service methods', () => {
    describe('createMatriculaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMatriculaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            estudiante: expect.any(Object),
            curso: expect.any(Object),
          })
        );
      });

      it('passing IMatricula should create a new form with FormGroup', () => {
        const formGroup = service.createMatriculaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            estudiante: expect.any(Object),
            curso: expect.any(Object),
          })
        );
      });
    });

    describe('getMatricula', () => {
      it('should return NewMatricula for default Matricula initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMatriculaFormGroup(sampleWithNewData);

        const matricula = service.getMatricula(formGroup) as any;

        expect(matricula).toMatchObject(sampleWithNewData);
      });

      it('should return NewMatricula for empty Matricula initial value', () => {
        const formGroup = service.createMatriculaFormGroup();

        const matricula = service.getMatricula(formGroup) as any;

        expect(matricula).toMatchObject({});
      });

      it('should return IMatricula', () => {
        const formGroup = service.createMatriculaFormGroup(sampleWithRequiredData);

        const matricula = service.getMatricula(formGroup) as any;

        expect(matricula).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMatricula should not enable id FormControl', () => {
        const formGroup = service.createMatriculaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMatricula should disable id FormControl', () => {
        const formGroup = service.createMatriculaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
