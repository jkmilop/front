import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstudiante } from '../estudiante.model';
import { EstudianteService } from '../service/estudiante.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './estudiante-delete-dialog.component.html',
})
export class EstudianteDeleteDialogComponent {
  estudiante?: IEstudiante;

  constructor(protected estudianteService: EstudianteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.estudianteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
