import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user.model';
import { Follow } from '../models/follow.model';
import { UserService } from '../services/user.service';
import { FollowService } from '../services/follow.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;
  public stats;
  public url;
  public follow;
  public followed;
  public following;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService,
  ) {
    this.url = "http://localhost:3000/api/";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.followed = false;
    this.following = false;
  }

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this.getUser(id);
      this.getCounters(id);
    })
  }

  getUser(id) {
    this._userService.getUser(id).subscribe(
      response => {
        console.log(response);
        if (response.user) {
          this.user = response.user;
        } else {
          this.status = 'error';
        }

        if (response.value.following != null) {
          this.following = true;
        } else {
          this.following = false;
        }


        if (response.value.followed != null) {
          this.followed = true;
        } else {
          this.followed = false;
        }
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/profile', this.identity._id]);
      }
    )
  }

  getCounters(id) {
    this._userService.getCounters(id).subscribe(
      response => {
        this.stats = response;
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  followUser(followed) {
    var follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(
      response => {
        this.following = true;
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  unfollowUser(followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(
      repsonse => {
        this.following = false;
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  public followUserOver;
  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }

  mouseLeave() {
    this.followUserOver = 0;
  }
}
