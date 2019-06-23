import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user.model';
import { Follow } from '../models/follow.model';
import { Group } from '../models/group.model';
import { UserService } from '../services/user.service';
import { GroupFollowService } from '../services/groupFollow.service';
import { GroupService } from '../services/group.service';
import LocationPicker from 'location-picker';
import { GroupFollow } from '../models/groupFollow.model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [UserService, GroupService, GroupFollowService]
})
export class GroupComponent implements OnInit {
  public title: string;
  public group: Group;
  public status: string;
  public statusFollow: string;
  public statusUn: string;
  public identity;
  public token;
  public stats;
  public url;
  public follow;
  public followed;
  public following;
  lp: LocationPicker;
  public user: User;
  public userId: any;
  public imAdmin: boolean;
  public groupFollows: boolean;
  public authorId;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _groupService: GroupService,
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
    this._route.params.subscribe(params => {
      let id = params['id'];
      this.getGroup(id);
    })
    this.getCounters();
  }

  getGroup(id) {
    this._groupService.getGroup(id).subscribe(
      response => {
        if (response.group) {
          this.group = response.group;
        } else {
          this.status = 'error';
        }
        this.lp = new LocationPicker('map', {
          setCurrentPosition: false,
        }, {
            zoom: 15,
            disableDefaultUI: true,
            zoomControl: true,
            center: { lat: Number(this.group.lat), lng: Number(this.group.lng) }
          });
        this.userId = this.group.author;
        
        this.getUser(this.userId._id);

        if (this.identity.role == "ROLE_ADMIN") {
          this.imAdmin = true;
        } else {
          this.imAdmin = false;
        }
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/home']);
      }
    )
  }

  getUser(id) {
    this._userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/profile', this.identity._id]);
      }
    )
  }

  deleteGroup(id) {
    this._groupService.deleteGroup(id).subscribe(
      response => {
        console.log(response);
        this._router.navigate(['/home']);
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  groupFollow() {
    var follow = new GroupFollow('', this.identity._id, this.group._id);

    this._groupFollowService.addFollow(this.token, follow).subscribe(
      response => {
        this.groupFollows = true;
        this.group.members = this.group.members + 1;
        console.log(this.group);
        this._groupService.updateGroup(this.group).subscribe(
          response => {
            if (!response.user) {
              this.statusFollow = 'error';
            } else {
              this.statusFollow = 'success';
              this.getCounters();
              console.log(response);
            }
          },
          error => {
            console.log(<any>error)
          }
        )
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  groupUnfollow() {
    this._groupFollowService.deleteFollow(this.token, this.group._id).subscribe(
      response => {
        if (!response.user) {
          this.statusUn = 'error';
        } else {
          this.statusUn = 'success';
          console.log(response);
          this.group.members = this.group.members - 1;
          console.log(this.group);
          this._groupService.updateGroup(this.group).subscribe(
            response => {
              if (!response.user) {
                this.statusFollow = 'error';
              } else {
                this.statusFollow = 'success';
                this.getCounters();
                console.log(response);
              }
            },
            error => {
              console.log(<any>error)
            }
          )
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  public followGroupOver;
  mouseEnter(group_id) {
    this.followGroupOver = group_id;
  }

  mouseLeave(group_id) {
    this.followGroupOver = 0;
  }

  getCounters() {
    this._userService.getCounters().subscribe(
      response => {
        sessionStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
        console.log(response);
      },
      error => {
        this.status = 'error';
      }
    )
  }

}
