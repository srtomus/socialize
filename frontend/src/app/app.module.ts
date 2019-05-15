import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AnonNavbarComponent } from './anon-navbar/anon-navbar.component';
import { LoggedNavbarComponent } from './logged-navbar/logged-navbar.component';
import { HomeComponent } from './home/home.component';

// Services
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProfileComponent } from './profile/profile.component';
import { InterestsComponent } from './interests/interests.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NotFoundComponent,
    LoginComponent,
    RegisterComponent,
    AnonNavbarComponent,
    LoggedNavbarComponent,
    HomeComponent,
    SettingsComponent,
    UsersComponent,
    SidebarComponent,
    ProfileComponent,
    InterestsComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    MomentModule
  ],
  providers: [
    appRoutingProviders,
    UserService,
    UserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
