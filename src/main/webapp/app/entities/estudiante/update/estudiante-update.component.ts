import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { EstudianteFormService, EstudianteFormGroup } from './estudiante-form.service';
import { IEstudiante } from '../estudiante.model';
import { EstudianteService } from '../service/estudiante.service';

@Component({
  selector: 'jhi-estudiante-update',
  templateUrl: './estudiante-update.component.html',
})
export class EstudianteUpdateComponent implements OnInit {
  isSaving = false;
  estudiante: IEstudiante | null = null;

  editForm: EstudianteFormGroup = this.estudianteFormService.createEstudianteFormGroup();

  constructor(
    protected estudianteService: EstudianteService,
    protected estudianteFormService: EstudianteFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudiante }) => {
      this.estudiante = estudiante;
      if (estudiante) {
        this.updateForm(estudiante);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estudiante = this.estudianteFormService.getEstudiante(this.editForm);
    if (estudiante.id !== null) {
      this.subscribeToSaveResponse(this.estudianteService.update(estudiante));
    } else {
      this.subscribeToSaveResponse(this.estudianteService.create(estudiante));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstudiante>>): void {
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

  protected updateForm(estudiante: IEstudiante): void {
    this.estudiante = estudiante;
    this.estudianteFormService.resetForm(this.editForm, estudiante);
  }
}
