import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { NavInicio } from '../nav-inicio/nav-inicio';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.html',
  imports: [FormsModule, NavInicio],
  styleUrl: './estadisticas.css',
})
export class Estadisticas implements OnInit {

  desde: string = '';
  hasta: string = '';
  chart: any = null;

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarPublicacionesPorUsuario();
    this.cargarComentariosPorDia();
    this.cargarComentariosPorPublicacion();
  }

  aplicarFiltro() {
    this.cargarPublicacionesPorUsuario();
  }

  aplicarFiltroComentario() {
    this.cargarComentariosPorDia();
  }

  aplicarFiltroComentarioPublicacion() {
    this.cargarComentariosPorPublicacion();
  }

  cargarPublicacionesPorUsuario() {

    const params: any = {};

    if (this.desde) params.desde = this.desde;
    if (this.hasta) params.hasta = this.hasta;

    this.http.get<any[]>(`${this.apiUrl}/publicaciones/publicaciones-por-usuario`,
      { params }
    )
    .subscribe({
      next: (data) => {
        this.armarGrafico(data);
      }
    });
  }

  cargarComentariosPorDia() {

  const params: any = {};
  if (this.desde) params.desde = this.desde;
  if (this.hasta) params.hasta = this.hasta;

  this.http.get<any[]>(`${this.apiUrl}/comentarios/comentarios-por-dia`, { params })
    .subscribe({
      next: (data) => {
        this.armarGraficoComentariosPorDia(data);
      }
    });
  }

  cargarComentariosPorPublicacion() {

  const params: any = {};
  if (this.desde) params.desde = this.desde;
  if (this.hasta) params.hasta = this.hasta;
  params.limit = 10;

  this.http.get<any[]>(`${this.apiUrl}/comentarios/comentarios-por-publicacion`, { params })
    .subscribe({
      next: (data) => {
        this.armarGraficoComentariosPorPublicacion(data);
      }
    });
}



  armarGrafico(data: any[]) {

    // eliminar gráfico previo si existe
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("graficoPublicaciones", {
      type: 'bar',
      data: {
        labels: data.map(item => item.usuario),
        datasets: [{
          label: 'Publicaciones por Usuario',
          data: data.map(item => item.cantidad),
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }

  armarGraficoComentariosPorDia(data: any[]) {

  if (this.chart) this.chart.destroy();

  this.chart = new Chart("graficoComentariosDia", {
    type: 'pie',
    data: {
      labels: data.map(item => item.fecha),
      datasets: [{
        label: 'Comentarios por Día',
        data: data.map(item => item.cantidad)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  });
}


armarGraficoComentariosPorPublicacion(data: any[]) {

  if (this.chart) this.chart.destroy();

  this.chart = new Chart("graficoComentariosPublicacion", {
    type: 'doughnut',
    data: {
      labels: data.map(item =>
        item.publicacionTitulo ? item.publicacionTitulo : `ID ${item.pubId}`
      ),
      datasets: [{
        label: 'Comentarios por Publicación',
        data: data.map(item => item.cantidad)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  });
}

}
