import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CovidService {
  constructor(private http: HttpClient) { }

  covidCall(uri: string): Observable<any> {
    const url = '0.0.0.0:8000/api/';
    return this.http.request('GET', url + uri);
  }
}
