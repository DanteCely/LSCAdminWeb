import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import {map} from 'rxjs/operators/map';
import { Word } from '../word';
import { URLFile } from '../urlfile';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ProxyWordsService {
  LSC_URL = 'http://18.208.61.61:12345';
  constructor(public http: HttpClient) {}

  getWords(): Observable<any> {
    return this.http.get<Word[]>( `${this.LSC_URL}/word/` );
  }

  addPicture(newPicture: FormData): Observable<any> {
    return this.http.post<URLFile>( `${this.LSC_URL}/picture/`, newPicture );
  }

  addVideo(newVideo: FormData): Observable<any> {
    return this.http.post<URLFile>( `${this.LSC_URL}/video/`, newVideo );
  }

  /** Revisar */
  updateWord(word: Word): Observable<any> {
    console.log(word);
    return this.http.put<Word>( `${this.LSC_URL}/word/${word.word}/`, word ).map(res => res);
  }

  /** Revisar */
  addWord(word: Word): Observable<any> {
    console.log(word);
    return this.http.post<Word>( `${this.LSC_URL}/word/`, word );
  }

  deleteWord(word: Word): Observable<any> {    
    console.log(word);
    return this.http.delete( `${this.LSC_URL}/word/${word.word}/`);
  }

}

