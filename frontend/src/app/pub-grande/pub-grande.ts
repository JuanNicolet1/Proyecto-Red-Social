import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavInicio } from '../nav-inicio/nav-inicio';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-pub-grande',
  imports: [FormsModule, NavInicio],
  templateUrl: './pub-grande.html'
})
export class PubGrande implements OnInit {
  
  @Input() id!: string;
  pub: any = null;  // <-- acá va la publicación cargada
  comentarios: any[] = [];
  usuarioActual : any = {};
  editado = false;
  edicion_activada = false;
  texto_editado = '';
  texto = '';
  comeId = '';
  limit = 5;

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id')!;
    }

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioActual  = JSON.parse(usuarioGuardado);
    }

    this.cargarPublicacion();
    this.mostrarComentarios(this.id);
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

  cargarPublicacion() {
    this.http.get(`${this.apiUrl}/publicaciones/${this.id}`)
      .subscribe({
        next: (data) => {
          this.pub = data;
        },
        error: (err) => {
          console.error('Error al obtener publicación', err);
        }
      });
  }

  async mostrarComentarios(pubId: string){
    console.log('a')
    this.http.get<any[]>(`${this.apiUrl}/comentarios/comentario/${pubId}`, {
      params: {
        limit: this.limit
      }})
      .subscribe({
        next: (data) => {
          console.log('aa');
          this.comentarios = data;
          console.log(this.comentarios)
        },
        error: (err) => {
          console.error('Error al obtener publicación', err);
        }
      });
  }

  editar(comId: string, texto_editado: string, pubId: string) {
    this.http.put(`${this.apiUrl}/comentarios/${pubId}/${comId}`,{
      text: this.texto_editado,
      editado: true,
    })
      .subscribe({
        next: () => {
          this.mostrarComentarios(pubId);
          this.edicion_activada = false;
        },
        error: (err) => {
          console.error('Error al obtener el comentario', err);
        }
      });
  }

  activarEdicion(id : string) {
    this.edicion_activada = true;
    this.comeId = id;
  }

  cargarMas() {
    this.limit += 5;
    this.mostrarComentarios(this.id);
    }
}


