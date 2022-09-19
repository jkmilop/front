import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICalificacion } from '../calificacion.model';
import { CalificacionService } from '../service/calificacion.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './calificacion-delete-dialog.component.html',
})
export class CalificacionDeleteDialogComponent {
  calificacion?: ICalificacion;

  constructor(protected calificacionService: CalificacionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.calificacionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
