import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDesarrollo } from '../desarrollo.model';

@Component({
  selector: 'jhi-desarrollo-detail',
  templateUrl: './desarrollo-detail.component.html',
})
export class DesarrolloDetailComponent implements OnInit {
  desarrollo: IDesarrollo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ desarrollo }) => {
      this.desarrollo = desarrollo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
