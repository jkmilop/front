import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MatriculaDetailComponent } from './matricula-detail.component';

describe('Matricula Management Detail Component', () => {
  let comp: MatriculaDetailComponent;
  let fixture: ComponentFixture<MatriculaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatriculaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ matricula: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MatriculaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MatriculaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load matricula on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.matricula).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
