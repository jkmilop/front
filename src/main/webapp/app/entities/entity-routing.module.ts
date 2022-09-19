import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'estudiante',
        data: { pageTitle: 'Estudiantes' },
        loadChildren: () => import('./estudiante/estudiante.module').then(m => m.EstudianteModule),
      },
      {
        path: 'profesor',
        data: { pageTitle: 'Profesors' },
        loadChildren: () => import('./profesor/profesor.module').then(m => m.ProfesorModule),
      },
      {
        path: 'curso',
        data: { pageTitle: 'Cursos' },
        loadChildren: () => import('./curso/curso.module').then(m => m.CursoModule),
      },
      {
        path: 'actividad',
        data: { pageTitle: 'Actividads' },
        loadChildren: () => import('./actividad/actividad.module').then(m => m.ActividadModule),
      },
      {
        path: 'matricula',
        data: { pageTitle: 'Matriculas' },
        loadChildren: () => import('./matricula/matricula.module').then(m => m.MatriculaModule),
      },
      {
        path: 'calificacion',
        data: { pageTitle: 'Calificacions' },
        loadChildren: () => import('./calificacion/calificacion.module').then(m => m.CalificacionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
