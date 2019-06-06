import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Group } from '../models/group.model';

@Injectable()
export class GroupService {
    public url: string;
    public identity;

    constructor(public _http: HttpClient) {
        this.url = "http://localhost:3000/api/";
    }

    addGroup(token, group: Group): Observable<any> {
        let params = JSON.stringify(group);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.post(this.url + 'savegroup', params, { headers: headers });
    }

    getGroups(token, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'getgroups/' + page, { headers: headers });
    }
}