import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CovidService {
  constructor(private http: HttpClient) { }

  getData(uri: string): Observable<any> {
    const url = 'http://127.0.0.1:8000/api';
    return this.http.request('GET', url + uri);
  }
}
