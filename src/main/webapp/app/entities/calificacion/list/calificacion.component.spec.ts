import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CalificacionService } from '../service/calificacion.service';

import { CalificacionComponent } from './calificacion.component';

describe('Calificacion Management Component', () => {
  let comp: CalificacionComponent;
  let fixture: ComponentFixture<CalificacionComponent>;
  let service: CalificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'calificacion', component: CalificacionComponent }]), HttpClientTestingModule],
      declarations: [CalificacionComponent],
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
      .overrideTemplate(CalificacionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CalificacionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CalificacionService);

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
    expect(comp.calificacions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to calificacionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCalificacionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCalificacionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
