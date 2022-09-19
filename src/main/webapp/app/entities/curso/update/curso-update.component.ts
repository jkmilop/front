import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CursoFormService, CursoFormGroup } from './curso-form.service';
import { ICurso } from '../curso.model';
import { CursoService } from '../service/curso.service';
import { IProfesor } from 'app/entities/profesor/profesor.model';
import { ProfesorService } from 'app/entities/profesor/service/profesor.service';

@Component({
  selector: 'jhi-curso-update',
  templateUrl: './curso-update.component.html',
})
export class CursoUpdateComponent implements OnInit {
  isSaving = false;
  curso: ICurso | null = null;

  profesorsSharedCollection: IProfesor[] = [];

  editForm: CursoFormGroup = this.cursoFormService.createCursoFormGroup();

  constructor(
    protected cursoService: CursoService,
    protected cursoFormService: CursoFormService,
    protected profesorService: ProfesorService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProfesor = (o1: IProfesor | null, o2: IProfesor | null): boolean => this.profesorService.compareProfesor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ curso }) => {
      this.curso = curso;
      if (curso) {
        this.updateForm(curso);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const curso = this.cursoFormService.getCurso(this.editForm);
    if (curso.id !== null) {
      this.subscribeToSaveResponse(this.cursoService.update(curso));
    } else {
      this.subscribeToSaveResponse(this.cursoService.create(curso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICurso>>): void {
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

  protected updateForm(curso: ICurso): void {
    this.curso = curso;
    this.cursoFormService.resetForm(this.editForm, curso);

    this.profesorsSharedCollection = this.profesorService.addProfesorToCollectionIfMissing<IProfesor>(
      this.profesorsSharedCollection,
      curso.profesor
    );
  }

  protected loadRelationshipsOptions(): void {
    this.profesorService
      .query()
      .pipe(map((res: HttpResponse<IProfesor[]>) => res.body ?? []))
      .pipe(
        map((profesors: IProfesor[]) => this.profesorService.addProfesorToCollectionIfMissing<IProfesor>(profesors, this.curso?.profesor))
      )
      .subscribe((profesors: IProfesor[]) => (this.profesorsSharedCollection = profesors));
  }
}
