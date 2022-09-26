import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActividad } from '../actividad.model';

@Component({
  selector: 'jhi-actividad-detail',
  templateUrl: './actividad-detail.component.html',
})
export class ActividadDetailComponent implements OnInit {
  actividad: IActividad | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actividad }) => {
      this.actividad = actividad;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
