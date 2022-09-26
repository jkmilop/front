import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DesarrolloFormService, DesarrolloFormGroup } from './desarrollo-form.service';
import { IDesarrollo } from '../desarrollo.model';
import { DesarrolloService } from '../service/desarrollo.service';
import { IEstudiante } from 'app/entities/back/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/back/estudiante/service/estudiante.service';
import { IActividad } from 'app/entities/back/actividad/actividad.model';
import { ActividadService } from 'app/entities/back/actividad/service/actividad.service';

@Component({
  selector: 'jhi-desarrollo-update',
  templateUrl: './desarrollo-update.component.html',
})
export class DesarrolloUpdateComponent implements OnInit {
  isSaving = false;
  desarrollo: IDesarrollo | null = null;

  estudiantesSharedCollection: IEstudiante[] = [];
  actividadsSharedCollection: IActividad[] = [];

  editForm: DesarrolloFormGroup = this.desarrolloFormService.createDesarrolloFormGroup();

  constructor(
    protected desarrolloService: DesarrolloService,
    protected desarrolloFormService: DesarrolloFormService,
    protected estudianteService: EstudianteService,
    protected actividadService: ActividadService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEstudiante = (o1: IEstudiante | null, o2: IEstudiante | null): boolean => this.estudianteService.compareEstudiante(o1, o2);

  compareActividad = (o1: IActividad | null, o2: IActividad | null): boolean => this.actividadService.compareActividad(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ desarrollo }) => {
      this.desarrollo = desarrollo;
      if (desarrollo) {
        this.updateForm(desarrollo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const desarrollo = this.desarrolloFormService.getDesarrollo(this.editForm);
    if (desarrollo.id !== null) {
      this.subscribeToSaveResponse(this.desarrolloService.update(desarrollo));
    } else {
      this.subscribeToSaveResponse(this.desarrolloService.create(desarrollo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDesarrollo>>): void {
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

  protected updateForm(desarrollo: IDesarrollo): void {
    this.desarrollo = desarrollo;
    this.desarrolloFormService.resetForm(this.editForm, desarrollo);

    this.estudiantesSharedCollection = this.estudianteService.addEstudianteToCollectionIfMissing<IEstudiante>(
      this.estudiantesSharedCollection,
      desarrollo.estudiante
    );
    this.actividadsSharedCollection = this.actividadService.addActividadToCollectionIfMissing<IActividad>(
      this.actividadsSharedCollection,
      desarrollo.actividad
    );
  }

  protected loadRelationshipsOptions(): void {
    this.estudianteService
      .query()
      .pipe(map((res: HttpResponse<IEstudiante[]>) => res.body ?? []))
      .pipe(
        map((estudiantes: IEstudiante[]) =>
          this.estudianteService.addEstudianteToCollectionIfMissing<IEstudiante>(estudiantes, this.desarrollo?.estudiante)
        )
      )
      .subscribe((estudiantes: IEstudiante[]) => (this.estudiantesSharedCollection = estudiantes));

    this.actividadService
      .query()
      .pipe(map((res: HttpResponse<IActividad[]>) => res.body ?? []))
      .pipe(
        map((actividads: IActividad[]) =>
          this.actividadService.addActividadToCollectionIfMissing<IActividad>(actividads, this.desarrollo?.actividad)
        )
      )
      .subscribe((actividads: IActividad[]) => (this.actividadsSharedCollection = actividads));
  }
}
