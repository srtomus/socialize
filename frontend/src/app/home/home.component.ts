import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Publication } from '../models/publication.model';
import { PublicationService } from '../services/publication.service';
import { $ } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PublicationService]
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

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.url = "http://localhost:3000/api/";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.page = 1;
    this.publication = new Publication("", "", "", "", this.identity._id);
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.stats = this._userService.getStats();
    this.getPublications(this.page);
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
          console.log(response);
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
          console.log(response);
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

  public noMore = false;
  viewMore() {
    this.page += 1;
    if (this.page == this.pages || this.items_per_page >= this.total) {
      this.noMore = true;
    } 

    this.getPublications(this.page, true);
  }
}
