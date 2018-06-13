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

  getMasterToken(): Observable<any> {
    return this.http.get( `${this.LSC_URL}/token/`);
  }

  getWords(masterToken): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', masterToken);
    return this.http.get<Word[]>( `${this.LSC_URL}/word/`, {headers: headers} );
  }

  addPicture(newPicture: FormData, masterToken): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', masterToken);
    return this.http.post<URLFile>( `${this.LSC_URL}/picture/`, newPicture, {headers: headers} );
  }

  addVideo(newVideo: FormData, masterToken): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', masterToken);
    return this.http.post<URLFile>( `${this.LSC_URL}/video/`, newVideo, {headers: headers} );
  }

  updateWord(word: Word, masterToken): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', masterToken);
    return this.http.put<Word>( `${this.LSC_URL}/word/${word.word}/`, word, {headers: headers} ).map(res => res);
  }

  addWord(word: Word, masterToken ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', masterToken);
    return this.http.post<Word>( `${this.LSC_URL}/word/`, word, {headers: headers} );
  }

  deleteWord(word: Word, masterToken ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', masterToken);
    return this.http.delete( `${this.LSC_URL}/word/${word.word}/`, {headers: headers});
  }

  deleteVideo(word: Word, masterToken ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', masterToken);
    return this.http.delete( `${this.LSC_URL}/video/${word.word}.mp4/`, {headers: headers});
  }

  deletePicture(word: Word, masterToken ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', masterToken);
    return this.http.delete( `${this.LSC_URL}/picture/${word.word}.jpg/`, {headers: headers});
  }

}

