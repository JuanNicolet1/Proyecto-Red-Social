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
},
{
    path: 'mi-perfil', 
    loadComponent: () => import("./mi-perfil/mi-perfil").then(m => m.MiPerfil)
},
{
    path: 'publicaciones', 
    loadComponent: () => import("./publicaciones/publicaciones").then(m => m.Publicaciones)
},
{
    path: 'inicio', 
    loadComponent: () => import("./inicio/inicio").then(m => m.Inicio)
}
];