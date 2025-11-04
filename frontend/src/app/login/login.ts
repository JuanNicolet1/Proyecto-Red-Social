import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Nav } from '../nav/nav';

@Component({
  selector: 'app-login',
  imports: [FormsModule, Nav],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessageEmail = '';
  errorMessageContrasena = '';
  mensajeExito = '';
  error = false;
  errorMessage = '';
  datos_puestos = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  login() {
    if(!this.email){
      this.errorMessageEmail = "Escribe el Email";
      this.datos_puestos = false;
    } 

    if(!this.password){
      this.errorMessageContrasena = "Escribe la contraseña";
      this.datos_puestos = false;
    }

    if(this.email && this.password){
      this.datos_puestos = true;
    }

    if(this.datos_puestos){
      this.http.post('http://localhost:3000/autenticacion/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        this.errorMessage = 'Contraseña';
      },
      error: (err) => {
        this.error = true;

        this.cdr.detectChanges();
        if (err.error.message === 'El usuario no existe') {
          this.errorMessage = 'El usuario no existe';
        } else if (err.error.message === 'Contraseña incorrecta') {
          this.errorMessage = 'Contraseña incorrecta';
        } else {
          this.errorMessage = 'Nombre de usuario o contraseña incorrectos';
        }
      }
    });  
  }}
}
