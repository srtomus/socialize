import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Message } from '../models/messages.model';
import { Follow } from '../models/follow.model';
import { FollowService } from '../services/follow.service';
import { MessagesService } from '../services/messages.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-messages',
  templateUrl: './add-messages.component.html',
  styleUrls: ['./add-messages.component.css'],
  providers: [FollowService, UserService, MessagesService]
})
export class AddMessagesComponent implements OnInit {
  public title: string;
  public message: Message;
  public identity;
  public token;
  public url: string;
  public status;
  public follows;

  constructor(
    private titleService: Title,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService,
    private _messagesService: MessagesService
  ) {
    this.url = 'http://' + window.location.hostname + ':3000/api/';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.message = new Message('', '', '', '', this.identity._id, '');
    this.title = "Enviar mensajes";
  }

  ngOnInit() {
    this.getMyFollows();
    this.setTitle(this.title);
  }

  setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  onSubmit(form) {
    this._messagesService.addMessage(this.token, this.message).subscribe(
      response => {
        if (response.message) {
          this.status = "success";
          form.reset();
        } else {
          this.status = "error";
        }
      },
      error => {
          this.status = "error";
          console.log(<any>error);
      }
    )
  }

  getMyFollows() {
    this._followService.getMyFollows(this.token).subscribe(
      response => {
        this.follows = response.follows;
      },
      error => {
        console.log(<any>error);
      }
    )
  }

}
