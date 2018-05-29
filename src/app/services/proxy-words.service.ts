import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Word } from '../word';
import { URLFile } from '../urlfile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProxyWordsService {
  testURL = 'https://jsonplaceholder.typicode.com/';
  LSC_URL = 'http://18.208.61.61:12345';
  constructor(public http: HttpClient) {}

  getWords(): Observable<any> {
    return this.http.get<Word[]>(`${this.LSC_URL}/word/`);
  }

  addPicture(newPicture: FormData): Observable<any> {
    return this.http.post<URLFile>(`${this.LSC_URL}/picture/`, newPicture );
  }

  addVideo(newVideo: FormData): Observable<any> {
    return this.http.post<URLFile>(`${this.LSC_URL}/video/`, newVideo );
  }
}
