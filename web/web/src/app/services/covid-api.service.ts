import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CovidService {
  constructor(private http: HttpClient) { }

  getData(uri: string): Observable<any> {
    const url = 'http://0.0.0.0:8000';
    return this.http.request('GET', url + uri);
  }
}
