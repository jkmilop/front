import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DesarrolloDetailComponent } from './desarrollo-detail.component';

describe('Desarrollo Management Detail Component', () => {
  let comp: DesarrolloDetailComponent;
  let fixture: ComponentFixture<DesarrolloDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesarrolloDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ desarrollo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DesarrolloDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DesarrolloDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load desarrollo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.desarrollo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
