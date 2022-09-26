import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActividadDetailComponent } from './actividad-detail.component';

describe('Actividad Management Detail Component', () => {
  let comp: ActividadDetailComponent;
  let fixture: ComponentFixture<ActividadDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActividadDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ actividad: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActividadDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActividadDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load actividad on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.actividad).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
