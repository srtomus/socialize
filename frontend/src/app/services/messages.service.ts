import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Message } from '../models/messages.model';

@Injectable()
export class MessagesService {
    public url: string;
    public identity;
    public token;

    constructor(public _http: HttpClient) {
        this.url =  "http://" + window.location.hostname + ":3000/api/";
    }

    addMessage(token, message):Observable<any> {
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.post(this.url + 'savemessage', params, {headers: headers})
    }

    getMessages(token, page = 1):Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'getmessages/' + page, {headers: headers})
    }

    getSentMessages(token, page = 1):Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'getsentmessages/' + page, {headers: headers})
    }
}