import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importar componentes
import { LandingComponent } from './landing/landing.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { InterestsComponent } from './interests/interests.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';
import { MessageComponent } from './message/message.component';
import { ProfileComponent } from './profile/profile.component';

// Importar servicios
import { UserGuard } from './services/user.guard';

// Array de rutas
const appRoutes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'interests', component: InterestsComponent},
    {path: 'home', component: HomeComponent, canActivate:[UserGuard]},
    {path: 'settings', component: SettingsComponent, canActivate:[UserGuard]},
    {path: 'discover/:page', component: UsersComponent, canActivate:[UserGuard]},
    {path: 'chat', component: MessageComponent, canActivate:[UserGuard]},
    {path: 'discover', component: UsersComponent, canActivate:[UserGuard]},
    {path: 'profile/:id', component: ProfileComponent, canActivate:[UserGuard]},
    {path: '**', component: NotFoundComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);