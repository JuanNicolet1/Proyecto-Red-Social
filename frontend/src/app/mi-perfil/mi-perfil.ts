import { Component, OnInit  } from '@angular/core';
import { NavInicio } from '../nav-inicio/nav-inicio';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Publicacion } from '../publicacion/publicacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  imports: [NavInicio, Publicacion],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit{
  usuario: any = {};
  publicaciones: any[] = [];

  offset = 0;
  limit = 3;

  private apiUrl = environment.apiUrl
  private apiUrlLocal = environment.apiUrlLocal

  constructor(private http: HttpClient, private router: Router) {}

   ngOnInit(): void {

    // Cargar datos del usuario
    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    } else {
      console.warn("Usuario no encontrado en storage todavía");
      return; // evita ejecutar publicaciones
    }

    // Pedir publicaciones
    if (this.usuario.username) {
      this.getPublicacionUsuario(this.usuario.username);
    }
  }


  getMiPerfil(id: string) {
    this.http.get<any>(`${this.apiUrl}/autenticacion/${id}`).subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al obtener perfil', err);
      },
    });
  }

  getPublicacionUsuario(user: string) {
    this.http.get<any>(`${this.apiUrl}/publicaciones/${user}/usuario`, {
      params: {
        offset: this.offset,
        limit: this.limit
      }}).subscribe({
      next: (data) => {
        console.log(data);
        this.publicaciones = data;
      },
      error: (err) => {
        console.error('Error al obtener publicaciones', err);
      },
    });
  }

  publicacionGrande(id: string) {
    this.router.navigate(['/pub-grande', id]);
  }
}
