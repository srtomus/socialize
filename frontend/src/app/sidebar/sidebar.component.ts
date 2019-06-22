import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Publication } from '../models/publication.model';
import { PublicationService } from '../services/publication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService]
})
export class SidebarComponent implements OnInit {
  public identity;
  public url: string;
  public token;
  public stats;
  public status;
  public publication: Publication;
  public interests: String[];

  constructor(
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.url = "http://localhost:3000/api/";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.publication = new Publication("", "", "", "", this.identity._id);
}

ngOnInit() {
  this.interests = this.identity.interests;
}

onSubmit(form) {
  this._publicationService.addPublication(this.token, this.publication).subscribe(
    response => {
      if (response.publication) {
        this.publication = response.publication;
        this.status = 'success';
        console.log(this.publication);
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

}
