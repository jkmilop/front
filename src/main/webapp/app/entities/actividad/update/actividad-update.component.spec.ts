import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActividadFormService } from './actividad-form.service';
import { ActividadService } from '../service/actividad.service';
import { IActividad } from '../actividad.model';
import { ICurso } from 'app/entities/curso/curso.model';
import { CursoService } from 'app/entities/curso/service/curso.service';

import { ActividadUpdateComponent } from './actividad-update.component';

describe('Actividad Management Update Component', () => {
  let comp: ActividadUpdateComponent;
  let fixture: ComponentFixture<ActividadUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actividadFormService: ActividadFormService;
  let actividadService: ActividadService;
  let cursoService: CursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActividadUpdateComponent],
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
      .overrideTemplate(ActividadUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActividadUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    actividadFormService = TestBed.inject(ActividadFormService);
    actividadService = TestBed.inject(ActividadService);
    cursoService = TestBed.inject(CursoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Curso query and add missing value', () => {
      const actividad: IActividad = { id: 456 };
      const curso: ICurso = { id: 61737 };
      actividad.curso = curso;

      const cursoCollection: ICurso[] = [{ id: 61050 }];
      jest.spyOn(cursoService, 'query').mockReturnValue(of(new HttpResponse({ body: cursoCollection })));
      const additionalCursos = [curso];
      const expectedCollection: ICurso[] = [...additionalCursos, ...cursoCollection];
      jest.spyOn(cursoService, 'addCursoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ actividad });
      comp.ngOnInit();

      expect(cursoService.query).toHaveBeenCalled();
      expect(cursoService.addCursoToCollectionIfMissing).toHaveBeenCalledWith(
        cursoCollection,
        ...additionalCursos.map(expect.objectContaining)
      );
      expect(comp.cursosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const actividad: IActividad = { id: 456 };
      const curso: ICurso = { id: 32796 };
      actividad.curso = curso;

      activatedRoute.data = of({ actividad });
      comp.ngOnInit();

      expect(comp.cursosSharedCollection).toContain(curso);
      expect(comp.actividad).toEqual(actividad);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActividad>>();
      const actividad = { id: 123 };
      jest.spyOn(actividadFormService, 'getActividad').mockReturnValue(actividad);
      jest.spyOn(actividadService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actividad });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actividad }));
      saveSubject.complete();

      // THEN
      expect(actividadFormService.getActividad).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(actividadService.update).toHaveBeenCalledWith(expect.objectContaining(actividad));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActividad>>();
      const actividad = { id: 123 };
      jest.spyOn(actividadFormService, 'getActividad').mockReturnValue({ id: null });
      jest.spyOn(actividadService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actividad: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actividad }));
      saveSubject.complete();

      // THEN
      expect(actividadFormService.getActividad).toHaveBeenCalled();
      expect(actividadService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActividad>>();
      const actividad = { id: 123 };
      jest.spyOn(actividadService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actividad });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(actividadService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCurso', () => {
      it('Should forward to cursoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(cursoService, 'compareCurso');
        comp.compareCurso(entity, entity2);
        expect(cursoService.compareCurso).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
