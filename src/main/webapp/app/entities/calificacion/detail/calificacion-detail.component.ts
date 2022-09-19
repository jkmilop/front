import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICalificacion } from '../calificacion.model';

@Component({
  selector: 'jhi-calificacion-detail',
  templateUrl: './calificacion-detail.component.html',
})
export class CalificacionDetailComponent implements OnInit {
  calificacion: ICalificacion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ calificacion }) => {
      this.calificacion = calificacion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
