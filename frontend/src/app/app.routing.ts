import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importar componentes
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileComponent } from './profile/profile.component';
import { InterestsComponent } from './interests/interests.component';
import { NewGroupComponent } from './new-group/new-group.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupComponent } from './group/group.component';


// Importar servicios
import { UserGuard } from './services/user.guard';

// Array de rutas
const appRoutes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent, canActivate:[UserGuard]},
    {path: 'settings', component: SettingsComponent, canActivate:[UserGuard]},
    {path: 'discover/:page', component: UsersComponent, canActivate:[UserGuard]},
    {path: 'chat', component: ChatComponent, canActivate:[UserGuard]},
    {path: 'discover', component: UsersComponent, canActivate:[UserGuard]},
    {path: 'interests', component: InterestsComponent, canActivate:[UserGuard]},
    {path: 'profile/:id', component: ProfileComponent, canActivate:[UserGuard]},
    {path: 'group/:id', component: GroupComponent, canActivate:[UserGuard]},
    {path: 'new-group', component: NewGroupComponent, canActivate:[UserGuard]},
    {path: 'groups/:page', component: GroupsComponent, canActivate:[UserGuard]},
    {path: 'groups', component: GroupsComponent, canActivate:[UserGuard]},
    {path: '**', component: LandingComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);