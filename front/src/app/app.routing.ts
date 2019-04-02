import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importar componentes
import { LandingComponent } from './landing/landing.component';
import { NotFoundComponent } from './not-found/not-found.component';


// Array de rutas
const appRoutes: Routes = [
    {path: '', component: LandingComponent},
    {path: '**', component: NotFoundComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);