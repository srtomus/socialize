import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GroupFollow } from '../models/groupFollow.model';

@Injectable()
export class GroupFollowService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = "http://localhost:3000/api/";
    }

    addFollow(token, follow):Observable<any> {
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.post(this.url+'groupfollow', params, {headers: headers});
    }

    deleteFollow(token, id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.delete(this.url+'groupfollowdelete/'+ id, {headers: headers});
    }
}