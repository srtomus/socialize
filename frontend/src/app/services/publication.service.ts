import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Publication } from '../models/publication.model';

@Injectable()
export class PublicationService {
    public url: string;
    public identity;

    constructor(public _http: HttpClient) {
        this.url = "http://localhost:3000/api/";
    }

    addPublication(token, publication: Publication): Observable<any> {
        let params = JSON.stringify(publication);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.post(this.url + 'savepublication', params, { headers: headers });
    }

    getPublications(token, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'getpublications/' + page, { headers: headers });
    }

    deletePublication(token, id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.delete(this.url + 'deletepublication/' + id, { headers: headers });
    }
}