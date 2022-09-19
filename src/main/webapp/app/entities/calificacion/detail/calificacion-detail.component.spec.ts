import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CalificacionDetailComponent } from './calificacion-detail.component';

describe('Calificacion Management Detail Component', () => {
  let comp: CalificacionDetailComponent;
  let fixture: ComponentFixture<CalificacionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalificacionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ calificacion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CalificacionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CalificacionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load calificacion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.calificacion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
