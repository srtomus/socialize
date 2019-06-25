import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainMessagesComponent } from "../main-messages/main-messages.component";
import { AddMessagesComponent } from "../add-messages/add-messages.component";
import { ReceivedMessagesComponent } from "../received-messages/received-messages.component";
import { SentMessagesComponent } from "../sent-messages/sent-messages.component";

const messagesRoutes: Routes = [
    {
        path: 'messages',
        component: MainMessagesComponent,
        children: [
            { path: '', redirectTo: 'received', pathMatch: 'full'},
            { path: 'send', component: AddMessagesComponent},
            { path: 'received', component: ReceivedMessagesComponent},
            { path: 'received/:page', component: ReceivedMessagesComponent},
            { path: 'sent', component: SentMessagesComponent},
            { path: 'sent/:page', component: SentMessagesComponent}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(messagesRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MessagesRoutingModule{}