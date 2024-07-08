import { Routes } from '@angular/router';
import { HomeComponent } from './core/pages/home/home.component';
import { AuthenticationComponent } from './core/pages/authentication/authentication.component';
import { authGuard } from './shared/guards/auth-guard.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./core/pages/home/home.component').then(m => m.HomeComponent), title: 'Home', canActivate: [authGuard] },
    { path: 'auth', loadComponent: () => import('./core/pages/authentication/authentication.component').then(m => m.AuthenticationComponent), title: 'Authentication' },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
