import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavInicio } from './nav-inicio';

describe('NavInicio', () => {
  let component: NavInicio;
  let fixture: ComponentFixture<NavInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavInicio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavInicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
