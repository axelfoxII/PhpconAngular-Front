import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'domseguro'
})
export class DomseguroPipe implements PipeTransform {
  constructor( private domSanitizer:DomSanitizer ){ }

  transform( value: string): any {
    let url = 'http://apiphp.com/views/img/';
    return this.domSanitizer.bypassSecurityTrustResourceUrl( url + value );
  }

}
