import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActividadService } from '../service/actividad.service';

import { ActividadComponent } from './actividad.component';

describe('Actividad Management Component', () => {
  let comp: ActividadComponent;
  let fixture: ComponentFixture<ActividadComponent>;
  let service: ActividadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'actividad', component: ActividadComponent }]), HttpClientTestingModule],
      declarations: [ActividadComponent],
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
      .overrideTemplate(ActividadComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActividadComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActividadService);

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
    expect(comp.actividads?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to actividadService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActividadIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActividadIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
