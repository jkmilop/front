import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActividadFormService, ActividadFormGroup } from './actividad-form.service';
import { IActividad } from '../actividad.model';
import { ActividadService } from '../service/actividad.service';
import { ICurso } from 'app/entities/curso/curso.model';
import { CursoService } from 'app/entities/curso/service/curso.service';

@Component({
  selector: 'jhi-actividad-update',
  templateUrl: './actividad-update.component.html',
})
export class ActividadUpdateComponent implements OnInit {
  isSaving = false;
  actividad: IActividad | null = null;

  cursosSharedCollection: ICurso[] = [];

  editForm: ActividadFormGroup = this.actividadFormService.createActividadFormGroup();

  constructor(
    protected actividadService: ActividadService,
    protected actividadFormService: ActividadFormService,
    protected cursoService: CursoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCurso = (o1: ICurso | null, o2: ICurso | null): boolean => this.cursoService.compareCurso(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actividad }) => {
      this.actividad = actividad;
      if (actividad) {
        this.updateForm(actividad);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actividad = this.actividadFormService.getActividad(this.editForm);
    if (actividad.id !== null) {
      this.subscribeToSaveResponse(this.actividadService.update(actividad));
    } else {
      this.subscribeToSaveResponse(this.actividadService.create(actividad));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActividad>>): void {
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

  protected updateForm(actividad: IActividad): void {
    this.actividad = actividad;
    this.actividadFormService.resetForm(this.editForm, actividad);

    this.cursosSharedCollection = this.cursoService.addCursoToCollectionIfMissing<ICurso>(this.cursosSharedCollection, actividad.curso);
  }

  protected loadRelationshipsOptions(): void {
    this.cursoService
      .query()
      .pipe(map((res: HttpResponse<ICurso[]>) => res.body ?? []))
      .pipe(map((cursos: ICurso[]) => this.cursoService.addCursoToCollectionIfMissing<ICurso>(cursos, this.actividad?.curso)))
      .subscribe((cursos: ICurso[]) => (this.cursosSharedCollection = cursos));
  }
}
