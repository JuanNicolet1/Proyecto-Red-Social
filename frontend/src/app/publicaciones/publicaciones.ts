import { Component, ChangeDetectorRef } from '@angular/core';
import { NavInicio } from '../nav-inicio/nav-inicio';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-publicaciones',
  imports: [NavInicio, FormsModule],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {
  usuario: any;
  titulo = '';
  descripcion = '';
  fecha = '';
  likes = 0
  image: File | null = null;
  imageUrl: string | null = null;

  imagenError = false;
  errorMessageFile = '';
  mensajeExito = '';
  
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}
  selectImage(event: Event){
      const input = event.target as HTMLInputElement;
      if(input.files && input.files[0]){
        const file = input.files[0]
        

        if(file.size > 5 * 1024* 1024){
          this.imagenError = true
          this.cdr.detectChanges();
          this.errorMessageFile = "La imagen debe ser de menor tamaño"
        }

        this.image = file

        this.imageUrl = URL.createObjectURL(file);

      }
    }

  publicar() {
      const usuarioGuardado = localStorage.getItem('usuario') || 'admin';
      if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      }

      const fechaActual = new Date().toISOString(); 
      const formData = new FormData();
      formData.append('usuario', this.usuario.username);
      formData.append('titulo', this.titulo);
      formData.append('descripcion', this.descripcion);
      formData.append('fecha', fechaActual);
      formData.append('likes', this.likes.toString());
      if(this.imageUrl){
        formData.append('imageUrl', this.imageUrl);
      }
      if (this.image) {
        formData.append('imagen', this.image);
      }
      this.http.post(`${this.apiUrl}/publicaciones/publicacion`, formData).subscribe({
      next: async (response: any) => {
            this.mensajeExito = "Publicado con exito.";
            localStorage.setItem('publicacion', JSON.stringify(response.publicacion));
            await this.router.navigate(['/inicio']);
          },
      })
  }
}
