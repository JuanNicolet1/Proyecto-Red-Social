import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgrandarLogo } from '../directivas/agrandar-logo';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, AgrandarLogo],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {

}
