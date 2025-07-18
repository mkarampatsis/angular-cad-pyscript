import { Routes } from '@angular/router';
import { DxfViewerComponent } from './components/dxf-viewer/dxf-viewer.component';
import { CadComponent } from './components/cad/cad.component';
import { ThreejsCadComponent } from './components/threejs-cad/threejs-cad.component';

export const routes: Routes = [
    { path: 'viewer', component: DxfViewerComponent },
    { path: 'cad', component: CadComponent},
    { path: 'threejs', component: ThreejsCadComponent},
    { path: '', component: DxfViewerComponent },
];
