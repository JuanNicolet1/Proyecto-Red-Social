import { Component, Input } from '@angular/core';
import { FechaPipe } from '../pipes/fecha-pipe';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.html',
  imports: [FechaPipe],
  styleUrls: ['./publicacion.css']
})
export class Publicacion {
  @Input() pub: any;
}
