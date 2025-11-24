import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'habilitar'
})
export class HabilitarPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Habilitado' : 'Deshabilitado';
  }

}
