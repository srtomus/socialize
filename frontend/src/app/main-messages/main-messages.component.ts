import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-messages',
  templateUrl: './main-messages.component.html',
  styleUrls: ['./main-messages.component.css']
})
export class MainMessagesComponent implements OnInit {
  public title:string;
  public identity;
  public url: string;
  public nickname: string;

  constructor(
    private _router: Router,
    private _userService: UserService
  ) { 
    this.title = 'Bienvenido a Every Meeting';
    this.url = "http://localhost:3000/api/";
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.nickname = this.identity.nickname;
  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }

  logout() {
    sessionStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);
  }

}
