import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadComponent } from './cad.component';

describe('CadComponent', () => {
  let component: CadComponent;
  let fixture: ComponentFixture<CadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
