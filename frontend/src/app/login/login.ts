import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessageEmail = '';
  errorMessageContrasena = '';
  mensajeExito = '';
  errorMessage = '';
  datos_puestos = false;

  constructor(private http: HttpClient) {}

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
        this.mensajeExito = 'Inicio de sesión exitoso';
        this.errorMessage = '';
      },
    })
  }}
}
