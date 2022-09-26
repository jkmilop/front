import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EstudianteCursoFormService } from './estudiante-curso-form.service';
import { EstudianteCursoService } from '../service/estudiante-curso.service';
import { IEstudianteCurso } from '../estudiante-curso.model';
import { ICurso } from 'app/entities/back/curso/curso.model';
import { CursoService } from 'app/entities/back/curso/service/curso.service';
import { IEstudiante } from 'app/entities/back/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/back/estudiante/service/estudiante.service';

import { EstudianteCursoUpdateComponent } from './estudiante-curso-update.component';

describe('EstudianteCurso Management Update Component', () => {
  let comp: EstudianteCursoUpdateComponent;
  let fixture: ComponentFixture<EstudianteCursoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estudianteCursoFormService: EstudianteCursoFormService;
  let estudianteCursoService: EstudianteCursoService;
  let cursoService: CursoService;
  let estudianteService: EstudianteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EstudianteCursoUpdateComponent],
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
      .overrideTemplate(EstudianteCursoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstudianteCursoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estudianteCursoFormService = TestBed.inject(EstudianteCursoFormService);
    estudianteCursoService = TestBed.inject(EstudianteCursoService);
    cursoService = TestBed.inject(CursoService);
    estudianteService = TestBed.inject(EstudianteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Curso query and add missing value', () => {
      const estudianteCurso: IEstudianteCurso = { id: 456 };
      const curso: ICurso = { id: 31873 };
      estudianteCurso.curso = curso;

      const cursoCollection: ICurso[] = [{ id: 87794 }];
      jest.spyOn(cursoService, 'query').mockReturnValue(of(new HttpResponse({ body: cursoCollection })));
      const additionalCursos = [curso];
      const expectedCollection: ICurso[] = [...additionalCursos, ...cursoCollection];
      jest.spyOn(cursoService, 'addCursoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudianteCurso });
      comp.ngOnInit();

      expect(cursoService.query).toHaveBeenCalled();
      expect(cursoService.addCursoToCollectionIfMissing).toHaveBeenCalledWith(
        cursoCollection,
        ...additionalCursos.map(expect.objectContaining)
      );
      expect(comp.cursosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Estudiante query and add missing value', () => {
      const estudianteCurso: IEstudianteCurso = { id: 456 };
      const estudiante: IEstudiante = { id: 13647 };
      estudianteCurso.estudiante = estudiante;

      const estudianteCollection: IEstudiante[] = [{ id: 94095 }];
      jest.spyOn(estudianteService, 'query').mockReturnValue(of(new HttpResponse({ body: estudianteCollection })));
      const additionalEstudiantes = [estudiante];
      const expectedCollection: IEstudiante[] = [...additionalEstudiantes, ...estudianteCollection];
      jest.spyOn(estudianteService, 'addEstudianteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudianteCurso });
      comp.ngOnInit();

      expect(estudianteService.query).toHaveBeenCalled();
      expect(estudianteService.addEstudianteToCollectionIfMissing).toHaveBeenCalledWith(
        estudianteCollection,
        ...additionalEstudiantes.map(expect.objectContaining)
      );
      expect(comp.estudiantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const estudianteCurso: IEstudianteCurso = { id: 456 };
      const curso: ICurso = { id: 8079 };
      estudianteCurso.curso = curso;
      const estudiante: IEstudiante = { id: 95267 };
      estudianteCurso.estudiante = estudiante;

      activatedRoute.data = of({ estudianteCurso });
      comp.ngOnInit();

      expect(comp.cursosSharedCollection).toContain(curso);
      expect(comp.estudiantesSharedCollection).toContain(estudiante);
      expect(comp.estudianteCurso).toEqual(estudianteCurso);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstudianteCurso>>();
      const estudianteCurso = { id: 123 };
      jest.spyOn(estudianteCursoFormService, 'getEstudianteCurso').mockReturnValue(estudianteCurso);
      jest.spyOn(estudianteCursoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudianteCurso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudianteCurso }));
      saveSubject.complete();

      // THEN
      expect(estudianteCursoFormService.getEstudianteCurso).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(estudianteCursoService.update).toHaveBeenCalledWith(expect.objectContaining(estudianteCurso));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstudianteCurso>>();
      const estudianteCurso = { id: 123 };
      jest.spyOn(estudianteCursoFormService, 'getEstudianteCurso').mockReturnValue({ id: null });
      jest.spyOn(estudianteCursoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudianteCurso: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudianteCurso }));
      saveSubject.complete();

      // THEN
      expect(estudianteCursoFormService.getEstudianteCurso).toHaveBeenCalled();
      expect(estudianteCursoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstudianteCurso>>();
      const estudianteCurso = { id: 123 };
      jest.spyOn(estudianteCursoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudianteCurso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estudianteCursoService.update).toHaveBeenCalled();
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

    describe('compareEstudiante', () => {
      it('Should forward to estudianteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(estudianteService, 'compareEstudiante');
        comp.compareEstudiante(entity, entity2);
        expect(estudianteService.compareEstudiante).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
