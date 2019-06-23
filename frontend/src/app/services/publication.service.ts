import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Publication } from '../models/publication.model';

@Injectable()
export class PublicationService {
    public url: string;
    public identity;
    public token;

    constructor(public _http: HttpClient) {
        this.url =  "http://" + window.location.hostname + ":3000/api/";
    }

    getToken() {
        let token = sessionStorage.getItem('token');

        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
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

    getMyPublications(token, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'getmypublications/' + page, { headers: headers });
    }

    getPublicationsUser(token, page = 1, user_id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'getpublicationsuser/'+ user_id + '/' + page, { headers: headers });
    }

    deletePublication(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

        return this._http.delete(this.url + 'deletepublication/' + id, { headers: headers });
    }


}