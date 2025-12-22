import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { elementAt } from 'rxjs';

// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Pagination} from 'swiper/modules'
import { ProductImagePipe } from "../../pipes/product-image.pipe";


@Component({
  selector: 'product-carrusel',
  imports: [ProductImagePipe],
  templateUrl: './product-carrusel.html',
  styles: `
  .swiper{
    width:100%;
    height: 500px;
  }`
})

/**
 * Todo lo referente al carrusel de las fotos. Se puede usar en cualquier lado.
 */
export class ProductCarrusel implements AfterViewInit {

  imagenes = input.required<string[]>();

  //obtenemos la referencia local
  swiperDiv = viewChild.required<ElementRef>('swiperDiv')

//Carrusel sacado de https://swiperjs.com/get-started

  ngAfterViewInit(): void {
    const element = this.swiperDiv().nativeElement;

    if (!element) return;
    console.log({ element });


    const swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,


      modules:[
        Navigation, Pagination
    ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });

  }

}
