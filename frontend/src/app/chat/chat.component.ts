import { Component, OnInit } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { ChatService } from './chat.service';
import { UserService } from '../services/user.service';
import * as $ from "jquery";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService, UserService]
})
export class ChatComponent {
  public identity;
  user: String;
  room: String;
  messageText: String;
  messageArray: Array<{ user: String, message: String }> = [];
  messageForm;
  constructor(
    private _chatService: ChatService,
    private _userService: UserService,
  ) {
    this.identity = this._userService.getIdentity();
    this._chatService.newUserJoined()
      .subscribe(data => this.messageArray.push(data));

    this._chatService.userLeftRoom()
      .subscribe(data => this.messageArray.push(data));

    this._chatService.newMessageReceived()
      .subscribe(data => this.messageArray.push(data));
  }

  join() {
    this._chatService.joinRoom({ user: this.identity.nickname, room: this.room });
  }

  leave() {
    this._chatService.leaveRoom({ user: this.identity.nickname, room: this.room });
  }

  sendMessage(form) {
    this._chatService.sendMessage({ user: this.identity.nickname, room: this.room, message: this.messageText });
    form.reset();
  }

}
