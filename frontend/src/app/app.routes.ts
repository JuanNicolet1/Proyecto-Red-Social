import { Routes } from '@angular/router';

export const routes: Routes = [
    
{path: '', redirectTo: 'registro', pathMatch: 'full'},
{
    path: 'registro', 
    loadComponent: () => import("./register/register").then(m => m.Register)
},
{
    path: 'login', 
    loadComponent: () => import("./login/login").then(m => m.Login)
}
];