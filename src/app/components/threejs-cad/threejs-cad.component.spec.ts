import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreejsCadComponent } from './threejs-cad.component';

describe('ThreejsCadComponent', () => {
  let component: ThreejsCadComponent;
  let fixture: ComponentFixture<ThreejsCadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreejsCadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThreejsCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
