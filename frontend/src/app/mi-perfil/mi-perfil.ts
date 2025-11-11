import { Component, OnInit  } from '@angular/core';
import { Nav } from '../nav/nav';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mi-perfil',
  imports: [Nav],
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

  constructor(private http: HttpClient) {}

   ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }
    this.getPublicacionUsuario(this.usuario.username);
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
        this.publicaciones = data;
      },
      error: (err) => {
        console.error('Error al obtener publicaciones', err);
      },
    });
  }

}
