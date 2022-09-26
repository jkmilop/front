import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EstudianteCursoDetailComponent } from './estudiante-curso-detail.component';

describe('EstudianteCurso Management Detail Component', () => {
  let comp: EstudianteCursoDetailComponent;
  let fixture: ComponentFixture<EstudianteCursoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudianteCursoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ estudianteCurso: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EstudianteCursoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EstudianteCursoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load estudianteCurso on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.estudianteCurso).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
