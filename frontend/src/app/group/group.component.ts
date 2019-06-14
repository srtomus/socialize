import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user.model';
import { Follow } from '../models/follow.model';
import { Group } from '../models/group.model';
import { UserService } from '../services/user.service';
import { FollowService } from '../services/follow.service';
import { GroupService } from '../services/group.service';
import LocationPicker from 'location-picker';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [UserService, GroupService]
})
export class GroupComponent implements OnInit {
  public title: string;
  public group: Group;
  public status: string;
  public identity;
  public token;
  public stats;
  public url;
  public follow;
  public followed;
  public following;
  lp: LocationPicker;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _groupService: GroupService,
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
      this.getGroup(id);
    })
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
  

        /*
          for (let key in this.groups) {
            this.lp = new LocationPicker(this.groups[key].created_at,{
              setCurrentPosition: false,
          }, {
              zoom: 15,
              center: {lat:this.groups[key].lat, lng: this.groups[key].lng}
          });
            console.log(this.groups[key].created_at);
          }*/
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/home']);
      }
    )
  }

}
