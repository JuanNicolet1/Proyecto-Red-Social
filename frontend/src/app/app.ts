import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  constructor(private http: HttpClient, private router: Router) {}
  protected readonly title = signal('frontend');

  cargando = true;
  mostrarModal = false;
  aviso: any;

  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal
  
  ngOnInit() {
  console.log("App inicializada.");

  const token = localStorage.getItem('token');
  console.log("Token encontrado:", token);
  this.iniciarTemporizadores();

  if (token) {
    console.log("Validando token...");

    this.http.get(`${this.apiUrlLocal}/autenticacion/autorizar`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        console.log("VALIDO:", res.usuario);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.cargando = false;
      },
      error: (err) => {
        console.error("ERROR AL VALIDAR", err);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.cargando = false;
        this.router.navigate(['/login']);
      }
    });
  } else {
    console.log("NO había token, cargando = false");
    this.cargando = false;
  }
}

  iniciarTemporizadores() {
  clearTimeout(this.aviso);

  this.aviso = setTimeout(() => {
    this.mostrarModal = true;
  }, 1 * 60 * 1000);
}

  
extenderSesion() {
  const token = localStorage.getItem('token');

  if (!token) return;

  this.http.post(`${this.apiUrlLocal}/autenticacion/refresh`, { token })
    .subscribe({
      next: (res: any) => {
        const nuevoToken = res.access_token;
        localStorage.setItem('token', nuevoToken);

        this.mostrarModal = false;

        // reiniciar temporizadores
        clearTimeout(this.aviso);
        this.iniciarTemporizadores();
      },
      error: () => {
        this.logout();
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.mostrarModal = false;

    clearTimeout(this.aviso);

    this.router.navigate(['/login']);
  }


}
