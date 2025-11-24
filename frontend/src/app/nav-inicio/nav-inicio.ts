import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { AgrandarLogo } from '../directivas/agrandar-logo';

@Component({
  selector: 'app-nav-inicio',
  imports: [RouterLink, AgrandarLogo],
  templateUrl: './nav-inicio.html',
  styleUrl: './nav-inicio.css',
})
export class NavInicio implements OnInit{
  usuarioActual : any = {};
  
  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioActual  = JSON.parse(usuarioGuardado);
    }
  }
}
