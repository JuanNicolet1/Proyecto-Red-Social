import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Publicacion } from '../publicacion/publicacion';
import { Router } from '@angular/router';
import { NavInicio } from '../nav-inicio/nav-inicio';
import { FormsModule } from '@angular/forms';
import { Like } from '../directivas/like';
import { Dislike } from '../directivas/dislike';
import { FechaPipe } from '../pipes/fecha-pipe';
import id from '@angular/common/locales/id';

@Component({
  selector: 'app-inicio',
  imports: [Publicacion, NavInicio, FormsModule, Like, Dislike, FechaPipe],
  standalone: true,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit{
  constructor(private http: HttpClient, private router: Router) {}

  likes = Number
  activo = true;
  texto = '';
  editado = false;
  comentarios_activados = false
  activo_publicacion = false;
  regresar = 0
  publicaciones: any[] = [];
  limit = 10
  offset = 0
  filtrar = false;
  usuario: string = '';
  usuarioActual : any = {};
  publicacion: any = {};

  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal
  
  ngOnInit(): void {
    this.getPublicaciones("fecha");
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioActual  = JSON.parse(usuarioGuardado);
    }
  }

  captarFiltro() {
    let filtro
    filtro = "fecha";
    this.filtrar = false
    return this.getPublicaciones(filtro);
  }

  captarFiltro2() {
    let filtro
    filtro = "likes"
    this.filtrar = true;
    return this.getPublicaciones(filtro);;
  }

   delete(publicacionId: string, user: string) {
    this.http.delete(`${this.apiUrl}/publicaciones/${publicacionId}/eliminar/${user}`).subscribe({
      next: (res) => {
        console.log('Publicación eliminada:', res);
        this.getPublicaciones("fecha");
      },
      error: (err) => console.error('Error al eliminar publicación', err)
    });
  }

  async getPublicaciones(filtro: string){
    this.http.get<any[]>(`${this.apiUrl}/publicaciones/${filtro}/filtro`, {
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

  like(publicacionId: string) {
    const usuarioId = this.usuarioActual._id;
    console.log('ID que se envía al backend:', publicacionId);
    this.http.post(`${this.apiUrl}/publicaciones/${publicacionId}/like/${usuarioId}`, {},
      {
      headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }}
    ).subscribe({
      next: (res) => {
        console.log('Like agregado:', res);
        if(this.filtrar === false){
          this.getPublicaciones("fecha");
        } else{
          this.getPublicaciones("likes");
        }
      },
      error: (err) => {
        console.error('Error al dar like', err);
      },
    });
  }

  dislike(publicacionId: string) {
    const usuarioId = this.usuarioActual._id;
    this.activo = true;
    console.log('ID que se envía al backend:', publicacionId);
    this.http.delete(`${this.apiUrl}/publicaciones/${publicacionId}/sacar/${usuarioId}`, {}).subscribe({
      next: (res) => {
        console.log('Like sacado:', res);
        if(this.filtrar === false){
          this.getPublicaciones("fecha");
        } else{
          this.getPublicaciones("likes");
        }
      },
      error: (err) => {
        console.error('Error al sacar el like', err);
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

  async getPerfil(usuario: string){
    this.getPublicacionUsuario(usuario)
  }

  cargarMas() {
    this.offset += this.limit;
    this.regresar += 1;
    if(this.filtrar === false){
            this.getPublicaciones("fecha");
          } else{
            this.getPublicaciones("likes");
          }
    }

  volver() {
    this.offset -= this.limit;
    this.regresar -= 1;
    if(this.filtrar === false){
            this.getPublicaciones("fecha");
          } else{
            this.getPublicaciones("likes");
          }
    }

  comentarios() {
    this.comentarios_activados = true
  }

  publicacionGrande(id: string) {
    this.router.navigate(['/pub-grande', id]);
  }
  

  async comentar(pubId: string, texto: string) {
    const fechaActual = new Date().toISOString();
    this.http.post(`${this.apiUrl}/comentarios/${pubId}`, {
      usuario: this.usuarioActual.username,
      text: this.texto,
      edit: this.editado,
      fecha: fechaActual,
    }).subscribe({
      next: (response: any) => {
        console.log('Comentario enviado:', response);
        this.editado = true;
      },
      error: (err) => {
        console.error('Error al comentar', err);
      }
    });
  }
}