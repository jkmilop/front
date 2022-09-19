import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ProfesorFormService, ProfesorFormGroup } from './profesor-form.service';
import { IProfesor } from '../profesor.model';
import { ProfesorService } from '../service/profesor.service';

@Component({
  selector: 'jhi-profesor-update',
  templateUrl: './profesor-update.component.html',
})
export class ProfesorUpdateComponent implements OnInit {
  isSaving = false;
  profesor: IProfesor | null = null;

  editForm: ProfesorFormGroup = this.profesorFormService.createProfesorFormGroup();

  constructor(
    protected profesorService: ProfesorService,
    protected profesorFormService: ProfesorFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profesor }) => {
      this.profesor = profesor;
      if (profesor) {
        this.updateForm(profesor);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const profesor = this.profesorFormService.getProfesor(this.editForm);
    if (profesor.id !== null) {
      this.subscribeToSaveResponse(this.profesorService.update(profesor));
    } else {
      this.subscribeToSaveResponse(this.profesorService.create(profesor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfesor>>): void {
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

  protected updateForm(profesor: IProfesor): void {
    this.profesor = profesor;
    this.profesorFormService.resetForm(this.editForm, profesor);
  }
}
