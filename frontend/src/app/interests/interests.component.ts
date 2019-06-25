import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.css'],
  providers: [UserService]
})
export class InterestsComponent implements OnInit {
  public title: string;
  public user:User;
  public url: string;
  public status: boolean;
  public identity;
  public token;
  public interests = {}

  constructor(
    private titleService: Title,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
    ) { 
    this.title = 'Intereses';
    this.url = 'http://' + window.location.hostname + ':3000/api/';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
  }
  ngOnInit() {
    this.setTitle(this.title);
  }

  setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  getInterests() {
    return Object.entries(this.interests).filter(arr => arr[1]).map(arr => arr[0]);
  }

  onSubmit() {
    var intArr = [];
    this.getInterests().forEach(i => {
      intArr.push(i);
    });
    this.user.interests = intArr;
    this._userService.updateInterests(this.user).subscribe(
      response => {
          this.status = true;
          sessionStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;
          this._router.navigate(["home"]);
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null) {
          this.status = false;
        }
      }
    )
  }

}
