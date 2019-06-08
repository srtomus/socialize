import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user.model';

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
  public status: string;
  public identity;
  public token;
  public interests = {}

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
    ) { 
    this.title = 'Intereses';
    this.url = "http://localhost:3000/api/";
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
  }
  ngOnInit() {
  }

  getInterests() {
    return Object.entries(this.interests).filter(arr => arr[1]).map(arr => arr[0]);
  }

  onSubmit() {
    this.getInterests().forEach(i => {
      console.log(i);
      this.user.interests.push(i);
    })
    this._userService.updateUser(this.user).subscribe(
      response => {
        console.log(response);
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null) {
          this.status = 'error';
        }
      }
    )
  }

}
