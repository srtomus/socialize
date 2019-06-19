import { Component, OnInit } from '@angular/core';
import LocationPicker from "location-picker";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Group } from '../models/group.model';
import { GroupService } from '../services/group.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css'],
  providers: [GroupService, UserService]
})
export class NewGroupComponent implements OnInit {
  lp: LocationPicker;
  public identity;
  public url: string;
  public token;
  public stats;
  public status;
  public group: Group;
  public lat;
  public lng;
  public coords;

  constructor(
    private _userService: UserService,
    private _groupService: GroupService,
    private _router: Router
  ) {
    this.url = "http://localhost:3000/api/";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.group = new Group("", "", this.identity._id, "", "" ,null, null, "", "" , "", "");
}

  ngOnInit() {
    this.lp = new LocationPicker('map',{
      setCurrentPosition: true, // You can omit this, defaults to true
  }, {
      zoom: 15,
      center: {lat:39.47018073020985, lng: -0.3770092068236952}
  });
  }

  setLocation() {
    this.coords = this.lp.getMarkerPosition();
    this.lat = this.coords.lat;
    this.lng = this.coords.lng;
    this.group.lat = this.lat;
    this.group.lng = this.lng;
 }

  onSubmit(form) {
    this._groupService.addGroup(this.token, this.group).subscribe(
      response => {
          this.group = response.group;
          console.log(response);
          form.reset();
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
}
