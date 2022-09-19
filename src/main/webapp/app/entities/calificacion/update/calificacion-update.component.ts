import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CalificacionFormService, CalificacionFormGroup } from './calificacion-form.service';
import { ICalificacion } from '../calificacion.model';
import { CalificacionService } from '../service/calificacion.service';
import { IActividad } from 'app/entities/actividad/actividad.model';
import { ActividadService } from 'app/entities/actividad/service/actividad.service';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/estudiante/service/estudiante.service';

@Component({
  selector: 'jhi-calificacion-update',
  templateUrl: './calificacion-update.component.html',
})
export class CalificacionUpdateComponent implements OnInit {
  isSaving = false;
  calificacion: ICalificacion | null = null;

  actividadsSharedCollection: IActividad[] = [];
  estudiantesSharedCollection: IEstudiante[] = [];

  editForm: CalificacionFormGroup = this.calificacionFormService.createCalificacionFormGroup();

  constructor(
    protected calificacionService: CalificacionService,
    protected calificacionFormService: CalificacionFormService,
    protected actividadService: ActividadService,
    protected estudianteService: EstudianteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareActividad = (o1: IActividad | null, o2: IActividad | null): boolean => this.actividadService.compareActividad(o1, o2);

  compareEstudiante = (o1: IEstudiante | null, o2: IEstudiante | null): boolean => this.estudianteService.compareEstudiante(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ calificacion }) => {
      this.calificacion = calificacion;
      if (calificacion) {
        this.updateForm(calificacion);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const calificacion = this.calificacionFormService.getCalificacion(this.editForm);
    if (calificacion.id !== null) {
      this.subscribeToSaveResponse(this.calificacionService.update(calificacion));
    } else {
      this.subscribeToSaveResponse(this.calificacionService.create(calificacion));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICalificacion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(calificacion: ICalificacion): void {
    this.calificacion = calificacion;
    this.calificacionFormService.resetForm(this.editForm, calificacion);

    this.actividadsSharedCollection = this.actividadService.addActividadToCollectionIfMissing<IActividad>(
      this.actividadsSharedCollection,
      calificacion.actividad
    );
    this.estudiantesSharedCollection = this.estudianteService.addEstudianteToCollectionIfMissing<IEstudiante>(
      this.estudiantesSharedCollection,
      calificacion.estudiante
    );
  }

  protected loadRelationshipsOptions(): void {
    this.actividadService
      .query()
      .pipe(map((res: HttpResponse<IActividad[]>) => res.body ?? []))
      .pipe(
        map((actividads: IActividad[]) =>
          this.actividadService.addActividadToCollectionIfMissing<IActividad>(actividads, this.calificacion?.actividad)
        )
      )
      .subscribe((actividads: IActividad[]) => (this.actividadsSharedCollection = actividads));

    this.estudianteService
      .query()
      .pipe(map((res: HttpResponse<IEstudiante[]>) => res.body ?? []))
      .pipe(
        map((estudiantes: IEstudiante[]) =>
          this.estudianteService.addEstudianteToCollectionIfMissing<IEstudiante>(estudiantes, this.calificacion?.estudiante)
        )
      )
      .subscribe((estudiantes: IEstudiante[]) => (this.estudiantesSharedCollection = estudiantes));
  }
}
