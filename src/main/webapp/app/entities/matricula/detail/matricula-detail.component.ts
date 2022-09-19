import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMatricula } from '../matricula.model';

@Component({
  selector: 'jhi-matricula-detail',
  templateUrl: './matricula-detail.component.html',
})
export class MatriculaDetailComponent implements OnInit {
  matricula: IMatricula | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ matricula }) => {
      this.matricula = matricula;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
