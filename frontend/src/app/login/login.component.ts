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
    this.user = new User("", "", "", "", "", "", null, "", "", "", "",  [""]);
  }

  ngOnInit() {
    let identity = this._userService.getIdentity();

    if (identity) {
      this._router.navigate(['/home']);
    }
  }

  onSubmit() {
    console.log(this.user);
    this._userService.prueba(this.user).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
    this._userService.signin(this.user).subscribe(
      response => {
        this.identity = response.user;

        if (!this.identity || !this.identity._id) {
          this.status = 'error';
        } else {
          sessionStorage.setItem('identity', JSON.stringify(this.identity));
          console.log(response);
          this.getToken();
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

  getToken() {
    this._userService.signin(this.user, 'true').subscribe(
      response => {
        this.token = response.token;

        if (this.token.length <= 0) {
          this.status = 'error';
        } else {
          sessionStorage.setItem('token', this.token);

          this.getCounters();
          
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

  getCounters() {
    this._userService.getCounters().subscribe(
      response => {
        sessionStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
      },
      error => {
        this.status = 'error';
      }
    )
  }
}
