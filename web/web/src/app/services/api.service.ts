import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getData(uri: string): Observable<any> {
    const url = 'https://api.werner.fyi';
    return this.http.request('GET', url + uri);
  }
}
