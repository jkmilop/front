import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DesarrolloFormService } from './desarrollo-form.service';
import { DesarrolloService } from '../service/desarrollo.service';
import { IDesarrollo } from '../desarrollo.model';
import { IEstudiante } from 'app/entities/back/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/back/estudiante/service/estudiante.service';
import { IActividad } from 'app/entities/back/actividad/actividad.model';
import { ActividadService } from 'app/entities/back/actividad/service/actividad.service';

import { DesarrolloUpdateComponent } from './desarrollo-update.component';

describe('Desarrollo Management Update Component', () => {
  let comp: DesarrolloUpdateComponent;
  let fixture: ComponentFixture<DesarrolloUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let desarrolloFormService: DesarrolloFormService;
  let desarrolloService: DesarrolloService;
  let estudianteService: EstudianteService;
  let actividadService: ActividadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DesarrolloUpdateComponent],
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
      .overrideTemplate(DesarrolloUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DesarrolloUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    desarrolloFormService = TestBed.inject(DesarrolloFormService);
    desarrolloService = TestBed.inject(DesarrolloService);
    estudianteService = TestBed.inject(EstudianteService);
    actividadService = TestBed.inject(ActividadService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Estudiante query and add missing value', () => {
      const desarrollo: IDesarrollo = { id: 456 };
      const estudiante: IEstudiante = { id: 23555 };
      desarrollo.estudiante = estudiante;

      const estudianteCollection: IEstudiante[] = [{ id: 96077 }];
      jest.spyOn(estudianteService, 'query').mockReturnValue(of(new HttpResponse({ body: estudianteCollection })));
      const additionalEstudiantes = [estudiante];
      const expectedCollection: IEstudiante[] = [...additionalEstudiantes, ...estudianteCollection];
      jest.spyOn(estudianteService, 'addEstudianteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ desarrollo });
      comp.ngOnInit();

      expect(estudianteService.query).toHaveBeenCalled();
      expect(estudianteService.addEstudianteToCollectionIfMissing).toHaveBeenCalledWith(
        estudianteCollection,
        ...additionalEstudiantes.map(expect.objectContaining)
      );
      expect(comp.estudiantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Actividad query and add missing value', () => {
      const desarrollo: IDesarrollo = { id: 456 };
      const actividad: IActividad = { id: 15103 };
      desarrollo.actividad = actividad;

      const actividadCollection: IActividad[] = [{ id: 81548 }];
      jest.spyOn(actividadService, 'query').mockReturnValue(of(new HttpResponse({ body: actividadCollection })));
      const additionalActividads = [actividad];
      const expectedCollection: IActividad[] = [...additionalActividads, ...actividadCollection];
      jest.spyOn(actividadService, 'addActividadToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ desarrollo });
      comp.ngOnInit();

      expect(actividadService.query).toHaveBeenCalled();
      expect(actividadService.addActividadToCollectionIfMissing).toHaveBeenCalledWith(
        actividadCollection,
        ...additionalActividads.map(expect.objectContaining)
      );
      expect(comp.actividadsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const desarrollo: IDesarrollo = { id: 456 };
      const estudiante: IEstudiante = { id: 58118 };
      desarrollo.estudiante = estudiante;
      const actividad: IActividad = { id: 78519 };
      desarrollo.actividad = actividad;

      activatedRoute.data = of({ desarrollo });
      comp.ngOnInit();

      expect(comp.estudiantesSharedCollection).toContain(estudiante);
      expect(comp.actividadsSharedCollection).toContain(actividad);
      expect(comp.desarrollo).toEqual(desarrollo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDesarrollo>>();
      const desarrollo = { id: 123 };
      jest.spyOn(desarrolloFormService, 'getDesarrollo').mockReturnValue(desarrollo);
      jest.spyOn(desarrolloService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ desarrollo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: desarrollo }));
      saveSubject.complete();

      // THEN
      expect(desarrolloFormService.getDesarrollo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(desarrolloService.update).toHaveBeenCalledWith(expect.objectContaining(desarrollo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDesarrollo>>();
      const desarrollo = { id: 123 };
      jest.spyOn(desarrolloFormService, 'getDesarrollo').mockReturnValue({ id: null });
      jest.spyOn(desarrolloService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ desarrollo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: desarrollo }));
      saveSubject.complete();

      // THEN
      expect(desarrolloFormService.getDesarrollo).toHaveBeenCalled();
      expect(desarrolloService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDesarrollo>>();
      const desarrollo = { id: 123 };
      jest.spyOn(desarrolloService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ desarrollo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(desarrolloService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEstudiante', () => {
      it('Should forward to estudianteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(estudianteService, 'compareEstudiante');
        comp.compareEstudiante(entity, entity2);
        expect(estudianteService.compareEstudiante).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareActividad', () => {
      it('Should forward to actividadService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(actividadService, 'compareActividad');
        comp.compareActividad(entity, entity2);
        expect(actividadService.compareActividad).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
