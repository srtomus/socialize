import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from '../models/messages.model';
import { Follow } from '../models/follow.model';
import { FollowService } from '../services/follow.service';
import { MessagesService } from '../services/messages.service';
import { Title } from '@angular/platform-browser';

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
  public page;
  public items_per_page;
  public pages;
  public total;
  public next_page;
  public prev_page;
  public areMessages: boolean;

  constructor(
    private titleService: Title,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService,
    private _messagesService: MessagesService
  ) {
    this.url = 'http://' + window.location.hostname + ':3000/api/';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title ="Mensajes enviados";
  }

  ngOnInit() {
    this.actualPage();
    this.setTitle(this.title);
  }

  setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  actualPage() {
    this._route.params.subscribe(params => {
      let page = +params['page'];
      this.page = page;

      if(!params['page']) {
        page = 1;
      }

      if(!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if(this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }

      this.getMessages(page);
    });
  }

  getMessages(page) {
    this._messagesService.getSentMessages(this.token, page).subscribe(
      response => {
        if(response.messages) {
          this.total = response.total;
          this.pages = response.pages;
          this.items_per_page = response.itemsPerPage;

          this.messages = response.messages;

          if (Object.keys(this.messages).length >= 1) {
            this.areMessages = true;
          } else {
            this.areMessages = false;
          }

          if(page > this.pages) {
            this._router.navigate(['/messages/sent', 1]);
          }
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
