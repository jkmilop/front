import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EstudianteCursoService } from '../service/estudiante-curso.service';

import { EstudianteCursoComponent } from './estudiante-curso.component';

describe('EstudianteCurso Management Component', () => {
  let comp: EstudianteCursoComponent;
  let fixture: ComponentFixture<EstudianteCursoComponent>;
  let service: EstudianteCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'estudiante-curso', component: EstudianteCursoComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [EstudianteCursoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(EstudianteCursoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstudianteCursoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EstudianteCursoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.estudianteCursos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to estudianteCursoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEstudianteCursoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEstudianteCursoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
