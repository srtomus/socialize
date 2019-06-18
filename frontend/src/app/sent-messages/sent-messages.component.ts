import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Message } from '../models/messages.model';
import { Follow } from '../models/follow.model';
import { FollowService } from '../services/follow.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-sent-messages',
  templateUrl: './sent-messages.component.html',
  styleUrls: ['./sent-messages.component.css'],
  providers: [FollowService, UserService, MessagesService]
})
export class SentMessagesComponent implements OnInit {
  public title: string;
  public message: Message;
  public identity;
  public token;
  public url: string;
  public status;
  public follows;
  public messages: Message[];

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService,
    private _messagesService: MessagesService
  ) {
    this.url = "http://localhost:3000/api/";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    this._messagesService.getSentMessages(this.token, 1).subscribe(
      response => {
          console.log(response);
        
      },
      error => {
        console.log(<any>error);
      }
    )
  }

}
