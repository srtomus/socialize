import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user.model';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [UserService, UploadService]
})
export class SettingsComponent implements OnInit {
  public title: string;
  public user:User;
  public url: string;
  public status: string;
  public identity;
  public token;
  public interests;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService
  ) { 
    this.title = 'Mis ajustes';
    this.url = "http://localhost:3000/api/";
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.interests = this.user.interests;
    console.log(this.interests);
  }

  onSubmit() {
    this._userService.updateUser(this.user).subscribe(
      response => {
        if(!response.user) {
          this.status = 'error';
        } else {
          this.status = 'success';
          sessionStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;

          this._uploadService.makeFileRequest(this.url+'uploadimage/'+this.user._id, [], this.filesToUpload, this.token, 'image')
          .then((result: any) => {
            console.log(result);
            console.log(result.user);
            this.user.image = result.user.image;
            sessionStorage.setItem('identity', JSON.stringify(this.user));
          })
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

  public filesToUpload: Array<File>
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

  logout() {
    sessionStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);
  }

}
