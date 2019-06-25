import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';
import { GroupFollowService } from '../services/groupFollow.service';
import { Group } from '../models/group.model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  providers: [GroupService, UserService]
})
export class GroupsComponent implements OnInit {
  public title:string;
  public identity;
  public url: string;
  public token;
  public page;
  public next_page;
  public prev_page;
  public status;
  public total;
  public pages;
  public groups: Group[];
  public follows;
  public loading: boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _groupService: GroupService,
    private _userService: UserService
  ) { 
    this.title = 'Gente';
    this.url = 'http://' + window.location.hostname + ':3000/api/';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.loading = true;
  }

  ngOnInit() {
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {
      let page = +params['page'];
      this.page = page;

      if(!params['page']) {
        page = 1;
      }

      if(!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if(this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }

      this.getAllGroups(page);
    });
  }

  getAllGroups(page) {
    this._groupService.getAllGroups(page).subscribe(
      response => {
        if(!response.groups) {
          this.status = 'error';
        } else {
          this.groups = response.groups;
          this.total = response.total;
          this.pages = response.pages;

          this.loading = false;
          if(page > this.pages) {
            this._router.navigate(['/groups', 1]);
          }
        }
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
