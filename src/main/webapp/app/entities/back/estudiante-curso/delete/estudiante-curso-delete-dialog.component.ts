import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstudianteCurso } from '../estudiante-curso.model';
import { EstudianteCursoService } from '../service/estudiante-curso.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './estudiante-curso-delete-dialog.component.html',
})
export class EstudianteCursoDeleteDialogComponent {
  estudianteCurso?: IEstudianteCurso;

  constructor(protected estudianteCursoService: EstudianteCursoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.estudianteCursoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
