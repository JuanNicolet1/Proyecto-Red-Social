import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
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
  fecha_nacimiento = '';
  errorMessage = '';
  errorMessageEmail = '';
  errorMessageConstrasena = '';
  errorMessageConstrasenas = '';
  errorMessageNombre = '';
  errorMessageApellido = '';
  errorMessageNacimiento = '';
  errorMessageUsername = '';
  mensajeExito = '';
  datos_puestos = false;
  errorMessageDescripcion = '';

  constructor(private router: Router, private http: HttpClient) {}

   registro() {
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

    

    
      console.log("a")
        this.http.post('http://localhost:3000/autenticacion/register', {
          nombre: this.nombre,
          apellido: this.apellido,
          email: this.email,
          username: this.username,
          password: this.password,
          descripcion: this.descripcion,
          fecha_nacimiento: this.fecha_nacimiento
        }).subscribe({
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
