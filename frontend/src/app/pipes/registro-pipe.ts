import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'registro'
})
export class RegistroPipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'ok') {
      return 'Registro exitoso.';
    }
    if (value === 'error') {
      return 'Error en el registro. Intenta nuevamente.';
    }
    return '';
  }

}
