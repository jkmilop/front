import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CalificacionFormService } from './calificacion-form.service';
import { CalificacionService } from '../service/calificacion.service';
import { ICalificacion } from '../calificacion.model';
import { IActividad } from 'app/entities/actividad/actividad.model';
import { ActividadService } from 'app/entities/actividad/service/actividad.service';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/estudiante/service/estudiante.service';

import { CalificacionUpdateComponent } from './calificacion-update.component';

describe('Calificacion Management Update Component', () => {
  let comp: CalificacionUpdateComponent;
  let fixture: ComponentFixture<CalificacionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let calificacionFormService: CalificacionFormService;
  let calificacionService: CalificacionService;
  let actividadService: ActividadService;
  let estudianteService: EstudianteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CalificacionUpdateComponent],
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
      .overrideTemplate(CalificacionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CalificacionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    calificacionFormService = TestBed.inject(CalificacionFormService);
    calificacionService = TestBed.inject(CalificacionService);
    actividadService = TestBed.inject(ActividadService);
    estudianteService = TestBed.inject(EstudianteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Actividad query and add missing value', () => {
      const calificacion: ICalificacion = { id: 456 };
      const actividad: IActividad = { id: 63215 };
      calificacion.actividad = actividad;

      const actividadCollection: IActividad[] = [{ id: 92094 }];
      jest.spyOn(actividadService, 'query').mockReturnValue(of(new HttpResponse({ body: actividadCollection })));
      const additionalActividads = [actividad];
      const expectedCollection: IActividad[] = [...additionalActividads, ...actividadCollection];
      jest.spyOn(actividadService, 'addActividadToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ calificacion });
      comp.ngOnInit();

      expect(actividadService.query).toHaveBeenCalled();
      expect(actividadService.addActividadToCollectionIfMissing).toHaveBeenCalledWith(
        actividadCollection,
        ...additionalActividads.map(expect.objectContaining)
      );
      expect(comp.actividadsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Estudiante query and add missing value', () => {
      const calificacion: ICalificacion = { id: 456 };
      const estudiante: IEstudiante = { id: 66416 };
      calificacion.estudiante = estudiante;

      const estudianteCollection: IEstudiante[] = [{ id: 88221 }];
      jest.spyOn(estudianteService, 'query').mockReturnValue(of(new HttpResponse({ body: estudianteCollection })));
      const additionalEstudiantes = [estudiante];
      const expectedCollection: IEstudiante[] = [...additionalEstudiantes, ...estudianteCollection];
      jest.spyOn(estudianteService, 'addEstudianteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ calificacion });
      comp.ngOnInit();

      expect(estudianteService.query).toHaveBeenCalled();
      expect(estudianteService.addEstudianteToCollectionIfMissing).toHaveBeenCalledWith(
        estudianteCollection,
        ...additionalEstudiantes.map(expect.objectContaining)
      );
      expect(comp.estudiantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const calificacion: ICalificacion = { id: 456 };
      const actividad: IActividad = { id: 88134 };
      calificacion.actividad = actividad;
      const estudiante: IEstudiante = { id: 62493 };
      calificacion.estudiante = estudiante;

      activatedRoute.data = of({ calificacion });
      comp.ngOnInit();

      expect(comp.actividadsSharedCollection).toContain(actividad);
      expect(comp.estudiantesSharedCollection).toContain(estudiante);
      expect(comp.calificacion).toEqual(calificacion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalificacion>>();
      const calificacion = { id: 123 };
      jest.spyOn(calificacionFormService, 'getCalificacion').mockReturnValue(calificacion);
      jest.spyOn(calificacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calificacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: calificacion }));
      saveSubject.complete();

      // THEN
      expect(calificacionFormService.getCalificacion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(calificacionService.update).toHaveBeenCalledWith(expect.objectContaining(calificacion));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalificacion>>();
      const calificacion = { id: 123 };
      jest.spyOn(calificacionFormService, 'getCalificacion').mockReturnValue({ id: null });
      jest.spyOn(calificacionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calificacion: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: calificacion }));
      saveSubject.complete();

      // THEN
      expect(calificacionFormService.getCalificacion).toHaveBeenCalled();
      expect(calificacionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalificacion>>();
      const calificacion = { id: 123 };
      jest.spyOn(calificacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calificacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(calificacionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareActividad', () => {
      it('Should forward to actividadService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(actividadService, 'compareActividad');
        comp.compareActividad(entity, entity2);
        expect(actividadService.compareActividad).toHaveBeenCalledWith(entity, entity2);
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
