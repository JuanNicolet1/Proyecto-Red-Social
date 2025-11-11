import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Nav } from '../nav/nav';
import { environment } from '../../environments/environments';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, Nav, RouterLink],
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

  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}

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
      this.http.post(`${this.apiUrl}/autenticacion/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: async (response: any) => {
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
        this.errorMessage = 'Contraseña';
        await this.router.navigate(['/mi-perfil']);
      },
      error: (err) => {
        this.error = true;

        this.cdr.detectChanges();
        if (err.error.message) {
          this.errorMessage = 'Credenciales incorrectas';
        }
      }
    });  
  }}
}
