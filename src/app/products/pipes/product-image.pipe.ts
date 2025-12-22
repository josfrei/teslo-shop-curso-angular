import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImagePipe'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): any {

    //si es un string
    if(typeof value === 'string'){
      return `${baseUrl}/files/product/${value}`
    }

    //asignamos a imagen la posicion 0
    const image = value[0];
    //si no hay ponemos la imagen por defecto
    if(!image){
      return './assets/images/placeholderimages/no-image.jpg'
    }

    //sino la imagen en la posicion 0
    return `${baseUrl}/files/product/${image}` ;
  }
}
