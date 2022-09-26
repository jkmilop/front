import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EstudianteCursoFormService, EstudianteCursoFormGroup } from './estudiante-curso-form.service';
import { IEstudianteCurso } from '../estudiante-curso.model';
import { EstudianteCursoService } from '../service/estudiante-curso.service';
import { ICurso } from 'app/entities/back/curso/curso.model';
import { CursoService } from 'app/entities/back/curso/service/curso.service';
import { IEstudiante } from 'app/entities/back/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/back/estudiante/service/estudiante.service';

@Component({
  selector: 'jhi-estudiante-curso-update',
  templateUrl: './estudiante-curso-update.component.html',
})
export class EstudianteCursoUpdateComponent implements OnInit {
  isSaving = false;
  estudianteCurso: IEstudianteCurso | null = null;

  cursosSharedCollection: ICurso[] = [];
  estudiantesSharedCollection: IEstudiante[] = [];

  editForm: EstudianteCursoFormGroup = this.estudianteCursoFormService.createEstudianteCursoFormGroup();

  constructor(
    protected estudianteCursoService: EstudianteCursoService,
    protected estudianteCursoFormService: EstudianteCursoFormService,
    protected cursoService: CursoService,
    protected estudianteService: EstudianteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCurso = (o1: ICurso | null, o2: ICurso | null): boolean => this.cursoService.compareCurso(o1, o2);

  compareEstudiante = (o1: IEstudiante | null, o2: IEstudiante | null): boolean => this.estudianteService.compareEstudiante(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudianteCurso }) => {
      this.estudianteCurso = estudianteCurso;
      if (estudianteCurso) {
        this.updateForm(estudianteCurso);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estudianteCurso = this.estudianteCursoFormService.getEstudianteCurso(this.editForm);
    if (estudianteCurso.id !== null) {
      this.subscribeToSaveResponse(this.estudianteCursoService.update(estudianteCurso));
    } else {
      this.subscribeToSaveResponse(this.estudianteCursoService.create(estudianteCurso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstudianteCurso>>): void {
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

  protected updateForm(estudianteCurso: IEstudianteCurso): void {
    this.estudianteCurso = estudianteCurso;
    this.estudianteCursoFormService.resetForm(this.editForm, estudianteCurso);

    this.cursosSharedCollection = this.cursoService.addCursoToCollectionIfMissing<ICurso>(
      this.cursosSharedCollection,
      estudianteCurso.curso
    );
    this.estudiantesSharedCollection = this.estudianteService.addEstudianteToCollectionIfMissing<IEstudiante>(
      this.estudiantesSharedCollection,
      estudianteCurso.estudiante
    );
  }

  protected loadRelationshipsOptions(): void {
    this.cursoService
      .query()
      .pipe(map((res: HttpResponse<ICurso[]>) => res.body ?? []))
      .pipe(map((cursos: ICurso[]) => this.cursoService.addCursoToCollectionIfMissing<ICurso>(cursos, this.estudianteCurso?.curso)))
      .subscribe((cursos: ICurso[]) => (this.cursosSharedCollection = cursos));

    this.estudianteService
      .query()
      .pipe(map((res: HttpResponse<IEstudiante[]>) => res.body ?? []))
      .pipe(
        map((estudiantes: IEstudiante[]) =>
          this.estudianteService.addEstudianteToCollectionIfMissing<IEstudiante>(estudiantes, this.estudianteCurso?.estudiante)
        )
      )
      .subscribe((estudiantes: IEstudiante[]) => (this.estudiantesSharedCollection = estudiantes));
  }
}
