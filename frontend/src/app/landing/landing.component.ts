import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { identity } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
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
    this._userService.signin(this.user).subscribe(
      response => {
        this.identity = response.user;
        console.log(response);
        if (!this.identity || !this.identity._id) {
          this.status = 'error';
        } else {
          sessionStorage.setItem('identity', JSON.stringify(this.identity));

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
