import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEstudianteCurso } from '../estudiante-curso.model';

@Component({
  selector: 'jhi-estudiante-curso-detail',
  templateUrl: './estudiante-curso-detail.component.html',
})
export class EstudianteCursoDetailComponent implements OnInit {
  estudianteCurso: IEstudianteCurso | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudianteCurso }) => {
      this.estudianteCurso = estudianteCurso;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
