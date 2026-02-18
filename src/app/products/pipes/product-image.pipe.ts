import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImagePipe'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[]): any {

    console.log(value)
    //si es null
    if(typeof value === null){
      return `${baseUrl}/files/product/${value}`
    }

    //si es un string y empieza por bob
    if(typeof value === 'string' && value.startsWith('blob:')){
      return value;
    }

    //si es un string
    if(typeof value === 'string'){
      return `${baseUrl}/files/product/${value}`
    }

    //asignamos a imagen la posicion 0
    const image = value?.at(0);
    //si no hay ponemos la imagen por defecto
    if(!image){
      return './assets/images/placeholderimages/no-image.jpg'
    }

    //sino la imagen en la posicion 0
    return `${baseUrl}/files/product/${image}` ;
  }
}
