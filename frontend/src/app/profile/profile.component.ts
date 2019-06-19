import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user.model';
import { Follow } from '../models/follow.model';
import { UserService } from '../services/user.service';
import { FollowService } from '../services/follow.service';
import { GroupFollowService } from '../services/groupFollow.service';
import { Publication } from '../models/publication.model';
import { PublicationService } from '../services/publication.service';
import { Group } from '../models/group.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService, PublicationService, GroupFollowService]
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
  public admin: boolean;
  public imAdmin: boolean;
  public userId;
  public publications: Publication;
  public publication: Publication;
  public page;
  public total;
  public pages;
  public items_per_page;
  public groups: Group[];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _followService: FollowService,
    private _groupFollowService: GroupFollowService
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
        this.user = response.user;

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

        if (response.user.role == "ROLE_ADMIN") {
          this.admin = true;
        } else {
          this.admin = false;
        }

        if (this.identity.role == "ROLE_ADMIN") {
          this.imAdmin = true;
        } else {
          this.imAdmin = false;
        }

        this.userId = response.user._id;
        this.getPublications(this.page, this.userId);
        this.getFollowingGroups(this.userId);
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/profile', this.identity._id]);
      }
    )
  }

  deleteUser(id) {
    this._userService.deleteUser(id).subscribe(
      response => {
        this._router.navigate(['/home']);
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  makeAdmin(id) {
    this._userService.getUser(id).subscribe(
      response => {
        this.user = response.user;
        this.user.role = "ROLE_ADMIN"
        this._userService.updateUser(this.user).subscribe(
          response => {
          },
          error => {
            console.log(<any>error);
          }
        )
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/profile', this.identity._id]);
      }
    )
  }

  makeUser(id) {
    this._userService.getUser(id).subscribe(
      response => {
        this.user = response.user;
        this.user.role = "ROLE_USER"
        this._userService.updateUser(this.user).subscribe(
          response => {
          },
          error => {
            console.log(<any>error);
          }
        )
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

  getPublications(page, userId, adding = false) {
    console.log(userId);
    this._publicationService.getPublicationsUser(this.token, page, userId).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.items_per_page = response.items_per_page;

          if (!adding) {
            this.publications = response.publications;
          } else {
            var arrayA = this.publications;
            var arrayB = response.publications;
            this.publications = arrayA.concat(arrayB);
          }

          if (page > this.pages) {
            this._router.navigate(['/home']);
          }
        } else {
          this.status = "error";
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    )
  }

  public noMorePublications = false;
  viewMorePublications() {
    this.page += 1;
    if (this.page == this.pages || this.items_per_page >= this.total) {
      this.noMorePublications = true;
    } 

    this.getPublications(this.page, true);
  }

  getFollowingGroups(userId) {
    this._groupFollowService.getMyFollowingGroups(this.token, userId).subscribe(
      response => {
        console.log(response);
        if(!response) {
          this.status = 'error';
        } else {
          this.groups = response.follows;
          this.total = response.total;
          this.pages = response.pages;
        }
      },
      error => {
        console.log(<any>error)
      }
    )
  }
}
