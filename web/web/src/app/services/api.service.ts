import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }

  url = 'https://api.werner.fyi/';

  getData(uri: string): Observable<any> {
    return this.http.request('GET', this.url + uri);
  }

  postData(uri: string, data: any): Observable<any> {
    return this.http.request(
      'POST', this.url + uri, {body: data});
  }
}
