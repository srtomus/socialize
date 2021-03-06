import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;
    stats: any;

    constructor(public _http: HttpClient) {
        this.url =  "http://" + window.location.hostname + ":3000/api/";
    }

    prueba(user: User):Observable<any> {
        var params = JSON.stringify(user);
        var headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'prueba', params, {headers: headers});
    }

    register(user: User): Observable<any> {
        var params = JSON.stringify(user);
        var headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'register', params, { headers: headers });
    }

    signin(user: User, gettoken = null): Observable<any> {
        if (gettoken != null) {
            user.gettoken = gettoken;
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', params, { headers: headers });
    }

    getIdentity() {
        let identity = JSON.parse(sessionStorage.getItem('identity'));
        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
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

    getStats() {
        let stats = JSON.parse(sessionStorage.getItem('stats'));

        if (stats != "undefined") {
            this.stats = stats;
        } else {
            this.stats = null;
        }

        return this.stats;
    }

    getCounters(userId = null): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

        if (userId != null) {
            return this._http.get(this.url + 'counters/' + userId, { headers: headers });
        } else {
            return this._http.get(this.url + 'counters', { headers: headers });
        }
    }

    updateUser(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

        return this._http.put(this.url+'updateuser/'+ user._id, params, {headers: headers});
    }

    updateInterests(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

        return this._http.put(this.url+'updateinterests/'+ user._id, params, {headers: headers});
    }

    getUsers(page = null): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    
        return this._http.get(this.url+'getusers/'+page, {headers: headers});
    }

    getUser(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    
        return this._http.get(this.url+'getuser/'+id, {headers: headers});
    }

    deleteUser(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    
        return this._http.delete(this.url+'deleteuser/'+id, {headers: headers});
    }
}