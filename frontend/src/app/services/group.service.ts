import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Group } from '../models/group.model';

@Injectable()
export class GroupService {
    public url: string;
    public identity;
    public token;

    constructor(public _http: HttpClient) {
        this.url = "http://localhost:3000/api/";
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

    addGroup(token, group: Group): Observable<any> {
        let params = JSON.stringify(group);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.post(this.url + 'savegroup', params, { headers: headers });
    }

    getAllGroups(page = null): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

        return this._http.get(this.url + 'getallgroups/' + page, { headers: headers });
    }

    getThreeItems(token, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'getthreeitems/' + page, { headers: headers });
    }

    getGroup(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    
        return this._http.get(this.url+'getgroup/'+id, {headers: headers});
    }

    deleteGroup(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    
        return this._http.delete(this.url+'deletegroup/'+id, {headers: headers});
    }
}