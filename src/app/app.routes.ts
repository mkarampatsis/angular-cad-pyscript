import { Routes } from '@angular/router';
import { DxfViewerComponent } from './components/dxf-viewer/dxf-viewer.component';
import { CadComponent } from './components/cad/cad.component';

export const routes: Routes = [
    { path: 'viewer', component: DxfViewerComponent },
    { path: 'cad', component: CadComponent},
    { path: '', component: DxfViewerComponent },
];
