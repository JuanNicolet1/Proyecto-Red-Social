import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.html',
  styleUrls: ['./publicacion.css']
})
export class Publicacion {
  @Input() pub: any;
}
