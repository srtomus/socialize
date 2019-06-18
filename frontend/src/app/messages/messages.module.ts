import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessagesRoutingModule } from './messages-routing.component';

import { MainMessagesComponent } from "../main-messages/main-messages.component";
import { AddMessagesComponent } from "../add-messages/add-messages.component";
import { ReceivedMessagesComponent } from "../received-messages/received-messages.component";
import { SentMessagesComponent } from "../sent-messages/sent-messages.component";

@NgModule({
    declarations: [
        MainMessagesComponent,
        AddMessagesComponent,
        ReceivedMessagesComponent,
        SentMessagesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MessagesRoutingModule
    ],
    exports: [
        MainMessagesComponent,
        AddMessagesComponent,
        ReceivedMessagesComponent,
        SentMessagesComponent
    ],
    providers: []
})
export class MessagesModule{}