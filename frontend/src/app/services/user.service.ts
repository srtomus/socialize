import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user.model';

@Injectable()
export class UserService{
    public url:string;
    public identity;
    public token;
    stats: any;

    constructor(public _http: HttpClient) {
        this.url = "http://localhost:3000/api/";
    }

    register(user: User): Observable<any> {
        var params = JSON.stringify(user);
        var headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'register', params, {headers: headers});
    }

    signin(user: User, gettoken = null): Observable<any> {
        if (gettoken != null) {
            user.gettoken = gettoken;
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url+'login', params, {headers: headers});
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));
        if(identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
    }

    getToken() {
        let token = localStorage.getItem('token');

        if(token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }

    getStats() {
        let stats = JSON.parse(localStorage.getItems('stats'));

        if(stats != "undefined") {
            this.stats = stats;
        } else {
            this.stats = null;
        }

        return this.stats;
    }

    getCounters(userId = null): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

        if(userId != null) {
            return this._http.get(this.url+'counters/'+userId, {headers: headers});
        } else {
            return this._http.get(this.url+'counters', {headers: headers});
        }
    }
}