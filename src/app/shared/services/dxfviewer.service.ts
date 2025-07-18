import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DxfviewerService {
    http: HttpClient = inject(HttpClient);

    getDxfFile(){
        // return this.http.get('assets/sample.dxf', {responseType: 'text'})
        return this.http.get('assets/sample2.dxf', {responseType: 'text'})
    }
}
