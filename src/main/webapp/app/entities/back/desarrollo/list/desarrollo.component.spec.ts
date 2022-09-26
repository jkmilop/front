import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DesarrolloService } from '../service/desarrollo.service';

import { DesarrolloComponent } from './desarrollo.component';

describe('Desarrollo Management Component', () => {
  let comp: DesarrolloComponent;
  let fixture: ComponentFixture<DesarrolloComponent>;
  let service: DesarrolloService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'desarrollo', component: DesarrolloComponent }]), HttpClientTestingModule],
      declarations: [DesarrolloComponent],
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
      .overrideTemplate(DesarrolloComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DesarrolloComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DesarrolloService);

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
    expect(comp.desarrollos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to desarrolloService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDesarrolloIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDesarrolloIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
