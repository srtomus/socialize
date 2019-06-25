import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GroupFollow } from '../models/groupFollow.model';

@Injectable()
export class GroupFollowService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url =  "http://" + window.location.hostname + ":3000/api/";
    }

    addFollow(token, follow):Observable<any> {
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.post(this.url+'groupFollow', params, {headers: headers});
    }

    deleteFollow(token, id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.delete(this.url+'groupUnfollow/'+ id, {headers: headers});
    }

    getMyFollowingGroups(token, id):Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'getMyGroupFollows/' + id, {headers: headers});
    }

    getMyFollowingGroupsProfile(token, id):Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'getmygroupfollowsprofile/' + id, {headers: headers});
}

    getFollowedGroups(token, id, page = 1):Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'groupfollowed/' + id + '/' + page, {headers: headers});
    }
}