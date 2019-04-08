import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title: string;
  public user:User;
  public status: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) { 
    this.title = 'Iniciar sesión';
    this.user = new User("", "", "", "", "", "", "", [""]);
  }

  ngOnInit() {
  }

  onSubmit() {
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
        if (errorMessage!= null) {
          this.status = 'error';
        }
      }
    )
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
          this._router.navigate(['/home']);
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage!= null) {
          this.status = 'error';
        }
      }
    )
  }
}
