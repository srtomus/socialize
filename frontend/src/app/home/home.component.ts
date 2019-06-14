import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Publication } from '../models/publication.model';
import { PublicationService } from '../services/publication.service';
import { Group } from '../models/group.model';
import { GroupService } from '../services/group.service';
import { GroupFollowService } from '../services/groupFollow.service';
import { GroupFollow } from '../models/groupFollow.model';
import { User } from '../models/user.model';
import LocationPicker from "location-picker";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PublicationService, GroupService, UserService, GroupFollowService]
})
export class HomeComponent implements OnInit {
  public title: string;
  public identity;
  public url: string;
  public stats;
  public token;
  public status;
  public publication: Publication;
  public page;
  public total;
  public pages;
  public items_per_page;
  public publications: Publication;
  public group: Group;
  public groups: Group;
  lp: LocationPicker;
  public loading: boolean;
  public imAdmin: boolean;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _groupService: GroupService,
    private _groupFollowService: GroupFollowService
  ) {
    this.url = "http://localhost:3000/api/";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.page = 1;
    this.publication = new Publication("", "", "", "", this.identity._id);
    this.loading = true;
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.stats = this._userService.getStats();
    this.getPublications(this.page);
    this.getGroups(this.page);
    if (this.identity.role == "ROLE_ADMIN") {
      this.imAdmin = true;
    } else {
      this.imAdmin = false;
    }
  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity();
    this.stats = this._userService.getStats();
  }

  onSubmit(form) {
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if (response.publication) {
          this.publication = response.publication;
          this.status = 'success';
          form.reset();
        } else {
          this.status = 'error';
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

  getPublications(page, adding = false) {
    this._publicationService.getPublications(this.token, page).subscribe(
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
          this.loading = false;
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


  getGroups(page, adding = false) {
    this._groupService.getThreeItems(this.token).subscribe(
      response => {
        if (response.groups) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.items_per_page = response.items_per_page;

          if (!adding) {
            this.groups = response.groups;
          } else {
            var arrayA = this.groups;
            var arrayB = response.groups;
            this.groups = arrayA.concat(arrayB);
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

  public noMoreGroups = false;
  viewMoreGroups() {
    this.page += 1;
    if (this.page == this.pages || this.items_per_page >= this.total) {
      this.noMoreGroups = true;
    } 

    this.getGroups(this.page, true);
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
