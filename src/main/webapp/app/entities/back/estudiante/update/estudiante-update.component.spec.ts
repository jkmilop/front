import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EstudianteFormService } from './estudiante-form.service';
import { EstudianteService } from '../service/estudiante.service';
import { IEstudiante } from '../estudiante.model';

import { EstudianteUpdateComponent } from './estudiante-update.component';

describe('Estudiante Management Update Component', () => {
  let comp: EstudianteUpdateComponent;
  let fixture: ComponentFixture<EstudianteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estudianteFormService: EstudianteFormService;
  let estudianteService: EstudianteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EstudianteUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EstudianteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstudianteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estudianteFormService = TestBed.inject(EstudianteFormService);
    estudianteService = TestBed.inject(EstudianteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const estudiante: IEstudiante = { id: 456 };

      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      expect(comp.estudiante).toEqual(estudiante);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstudiante>>();
      const estudiante = { id: 123 };
      jest.spyOn(estudianteFormService, 'getEstudiante').mockReturnValue(estudiante);
      jest.spyOn(estudianteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudiante }));
      saveSubject.complete();

      // THEN
      expect(estudianteFormService.getEstudiante).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(estudianteService.update).toHaveBeenCalledWith(expect.objectContaining(estudiante));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstudiante>>();
      const estudiante = { id: 123 };
      jest.spyOn(estudianteFormService, 'getEstudiante').mockReturnValue({ id: null });
      jest.spyOn(estudianteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudiante: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudiante }));
      saveSubject.complete();

      // THEN
      expect(estudianteFormService.getEstudiante).toHaveBeenCalled();
      expect(estudianteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstudiante>>();
      const estudiante = { id: 123 };
      jest.spyOn(estudianteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estudianteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
