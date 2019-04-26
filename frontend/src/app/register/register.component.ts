import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'Registro';
    this.user = new User("", "", "", "", null, "", "", "", "",  [""]);
  }

  ngOnInit() {
    let identity = this._userService.getIdentity();

    if (identity) {
      this._router.navigate(['/home']);
    }
  }

  onSubmit() {
    this._userService.register(this.user).subscribe(
      response => {
        if (response.user && response.user._id) {
          this._userService.signin(this.user).subscribe(
            response => {
              this.identity = response.user;
              console.log(this.identity);
              if (!this.identity || !this.identity._id) {
                this.status = 'error';
              } else {
                localStorage.setItem('identity', JSON.stringify(this.identity));

                this.gettoken();
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
          this._router.navigate(['/interests']);
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  gettoken() {
    this._userService.signin(this.user, 'true').subscribe(
      response => {
        this.token = response.token;
        console.log(this.token);
        if (this.token.length <= 0) {
          this.status = 'error';
        } else {
          localStorage.setItem('token', this.token);
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
