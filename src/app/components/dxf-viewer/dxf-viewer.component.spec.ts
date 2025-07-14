import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DxfViewerComponent } from './dxf-viewer.component';

describe('DxfViewerComponent', () => {
  let component: DxfViewerComponent;
  let fixture: ComponentFixture<DxfViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DxfViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DxfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
