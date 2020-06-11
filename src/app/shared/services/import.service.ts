import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  prefix = '/api/import';
  constructor(private http: HttpClient) {}

  importSurvey(data: object): Observable<any> {
    return this.http.post(`${this.prefix}/survey`, data);
  }

  getImportHistory(): Observable<any> {
    return this.http.get(`${this.prefix}/history`);
  }

  createImportInfo(data: object): Observable<any> {
    return this.http.post(`${this.prefix}/info`, data);
  }
}
