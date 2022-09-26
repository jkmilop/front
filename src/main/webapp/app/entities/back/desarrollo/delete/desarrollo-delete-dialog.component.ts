import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDesarrollo } from '../desarrollo.model';
import { DesarrolloService } from '../service/desarrollo.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './desarrollo-delete-dialog.component.html',
})
export class DesarrolloDeleteDialogComponent {
  desarrollo?: IDesarrollo;

  constructor(protected desarrolloService: DesarrolloService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.desarrolloService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
