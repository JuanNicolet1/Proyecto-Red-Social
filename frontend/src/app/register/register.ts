import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Nav } from '../nav/nav';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-register',
  imports: [FormsModule, Nav, RouterLink],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  nombre = '';
  apellido = '';
  email = '';
  username = '';
  password = '';
  password2 = '';
  descripcion = '';
  rol = "Usuario";
  fecha_nacimiento = '';
  image: File | null = null;
  imageUrl: String | null = null;
  errorMessage = '';
  errorMessageImagen = '';
  errorMessageEmail = '';
  errorMessageConstrasena = '';
  errorMessageConstrasenas = '';
  errorMessageNombre = '';
  errorMessageApellido = '';
  errorMessageNacimiento = '';
  errorMessageUsername = '';
  imagenError = false;
  errorMessageFile = ''
  mensajeExito = '';
  datos_puestos = false;
  errorMessageDescripcion = '';
  error = false;
  habilitado = true;

  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  validarPassword(password: string): boolean {
    const regex = /^(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

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


   registro() {
    if(!this.image){
      this.errorMessageImagen = "Selecciona una imagen";
      this.datos_puestos = false;
    } 

    if(!this.email){
      this.errorMessageEmail = "Escribe el Email";
      this.datos_puestos = false;
    } 

    if(!this.password){
      this.errorMessageConstrasena = "Escribe la contraseña";
      this.datos_puestos = false;
    }

    if(!this.nombre){
      this.errorMessageNombre = "Escribe el nombre";
      this.datos_puestos = false;
    }

    if(!this.apellido){
      this.errorMessageApellido = "Escribe el apellido";
      this.datos_puestos = false;
    }

    if(!this.username){
      this.errorMessageUsername = "Escribe el usuario";
      this.datos_puestos = false;
    }

    if(!this.fecha_nacimiento){
      this.errorMessageNacimiento = "Escribe la fecha de nacimiento";
      this.datos_puestos = false;
    }

    if(this.password !== this.password2){
      this.errorMessageConstrasenas = "Las contraseñas no coinciden";
      this.datos_puestos = false;
    }

    if(!this.descripcion){
      this.errorMessageDescripcion = "Escribe una descripción";
      this.datos_puestos = false;
    }

    if (!this.validarPassword(this.password)) {
      this.error = true;
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres, un número y un signo.';
      return;
    }

    

    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido', this.apellido);
    formData.append('email', this.email);
    formData.append('username', this.username);
    formData.append('password', this.password);
    formData.append('descripcion', this.descripcion);
    formData.append('fecha_nacimiento', this.fecha_nacimiento);
    formData.append('rol', this.rol);
    formData.append('habilitado', this.habilitado.toString());
    if(this.image){
      formData.append('imagen', this.image);
    }

    
      console.log("a")
        this.http.post(`${this.apiUrlLocal}/autenticacion/register`, formData 
        ).subscribe({
          next: async (response) => {
            this.mensajeExito = "Registro exitoso.";
            await this.router.navigate(['/login']);
          },
          error: (error) => {
            this.errorMessage = "Error en el registro. Intenta nuevamente.";
          }
        });
    
  }
}

