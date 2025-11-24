import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubGrande } from './pub-grande';

describe('PubGrande', () => {
  let component: PubGrande;
  let fixture: ComponentFixture<PubGrande>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubGrande]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PubGrande);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
