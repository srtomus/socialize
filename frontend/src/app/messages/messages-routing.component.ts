import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainMessagesComponent } from "../main-messages/main-messages.component";
import { AddMessagesComponent } from "../add-messages/add-messages.component";
import { ReceivedMessagesComponent } from "../received-messages/received-messages.component";
import { SentMessagesComponent } from "../sent-messages/sent-messages.component";

const messagesRoutes: Routes = [
    {
        path: 'mensajes',
        component: MainMessagesComponent,
        children: [
            { path: '', redirectTo: 'recibidos', pathMatch: 'full'},
            { path: 'enviar', component: AddMessagesComponent},
            { path: 'recibidos', component: ReceivedMessagesComponent},
            { path: 'recibidos/:page', component: ReceivedMessagesComponent},
            { path: 'enviados', component: SentMessagesComponent},
            { path: 'enviados/:page', component: SentMessagesComponent}
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