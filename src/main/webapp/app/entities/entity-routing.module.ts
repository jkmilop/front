import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'curso',
        data: { pageTitle: 'Cursos' },
        loadChildren: () => import('./back/curso/curso.module').then(m => m.BackCursoModule),
      },
      {
        path: 'estudiante',
        data: { pageTitle: 'Estudiantes' },
        loadChildren: () => import('./back/estudiante/estudiante.module').then(m => m.BackEstudianteModule),
      },
      {
        path: 'estudiante-curso',
        data: { pageTitle: 'EstudianteCursos' },
        loadChildren: () => import('./back/estudiante-curso/estudiante-curso.module').then(m => m.BackEstudianteCursoModule),
      },
      {
        path: 'profesor',
        data: { pageTitle: 'Profesors' },
        loadChildren: () => import('./back/profesor/profesor.module').then(m => m.BackProfesorModule),
      },
      {
        path: 'actividad',
        data: { pageTitle: 'Actividads' },
        loadChildren: () => import('./back/actividad/actividad.module').then(m => m.BackActividadModule),
      },
      {
        path: 'desarrollo',
        data: { pageTitle: 'Desarrollos' },
        loadChildren: () => import('./back/desarrollo/desarrollo.module').then(m => m.BackDesarrolloModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
