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
  public arePublications: boolean;
  public areGroups: boolean;
  public groupsImg;
  public publicationsImg;
  public followsImg;
  public groupsAlt;
  public publicationsAlt;
  public followsAlt;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _followService: FollowService,
    private _groupFollowService: GroupFollowService
  ) {
    this.url = 'http://' + window.location.hostname + ':3000/api/';
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
        console.log(response);
        if (response.followed < 5) {
          this.followsImg = "../../assets/noFollows.png";
          this.followsAlt = "Menos de 5 seguidores"
        } else if (response.followed >= 5) {
          this.followsImg = "../../assets/followsBronze.png";
          this.followsAlt = "5 o más seguidores";
        } else if (response.followed >= 20) {
          this.followsImg = "../../assets/followsSilver.png";
          this.followsAlt = "20 o más seguidores";
        } else if (response.followed >= 50) {
          this.followsImg = "../../assets/followsGold.png";
          this.followsAlt = "50 o más seguidores";
        }

        if (response.group < 1) {
          this.groupsImg = "../../assets/noGroups.png";
          this.groupsAlt = "No estás unido a ningún grupo";
        } else if (response.group >= 1) {
          this.groupsImg = "../../assets/groupsBronze.png";
          this.groupsAlt = "1 o más grupos";
        } else if (response.group >= 10) {
          this.groupsImg = "../../assets/groupsSilver.png";
          this.groupsAlt = "10 o más grupos";
        } else if (response.group >= 20) {
          this.groupsImg = "../../assets/groupsGold.png";
          this.groupsAlt = "20 o más grupos";
        }

        if (response.publication < 10) {
          this.publicationsImg = "../../assets/noPublications.png";
          this.publicationsAlt = "Menos de 10 publicaciones";
        } else if (response.publication >= 10) {
          this.publicationsImg = "../../assets/publicationsBronze.png";
          this.publicationsAlt = "10 o más publicaciones";
        } else if (response.publication >= 50) {
          this.publicationsImg = "../../assets/publicationsSilver.png";
          this.publicationsAlt = "50 o más publicaciones";
        } else if (response.publication >= 100) {
          this.publicationsImg = "../../assets/publicationsGold.png";
          this.publicationsAlt = "100 o más publicaciones";
        }
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

          if (Object.keys(this.publications).length >= 1) {
            this.arePublications = true;
          } else {
            this.arePublications = false;
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
    this._groupFollowService.getMyFollowingGroupsProfile(this.token, userId).subscribe(
      response => {
        if(!response) {
          this.status = 'error';
        } else {
          this.groups = response.follows;
          console.log(this.groups);
          this.total = response.total;
          this.pages = response.pages;
        }

        if (Object.keys(this.groups).length >= 1) {
          this.areGroups = true;
        } else {
          this.areGroups = false;
        }
      },
      error => {
        console.log(<any>error)
      }
    )
  }

  deletePublication(id) {
    this._publicationService.deletePublication(id).subscribe(
      response => {
        window.location.reload();
      },
      error => {
        console.log(<any>error);
      }
    )
  }
}
