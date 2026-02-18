import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { elementAt } from 'rxjs';

// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules'
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
export class ProductCarrusel implements AfterViewInit, OnChanges {

  imagenes = input.required<string[]>();
  //obtenemos la referencia local
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper: Swiper | undefined = undefined;

  ngOnChanges(changes: SimpleChanges): void {
    //cuando carga la PRIMERA VEZ no hace nada
    if (changes['imagenes'].firstChange) {
      return;
    }

    //la SEGUNDA VEZ

    //si no hay swipper no se hace nada
    if (!this.swiper) return;
    //destruimos la instacia y limpiamos los estilos
    this.swiper.destroy(true, true);

    const paginationElement: HTMLDivElement = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');
    paginationElement.innerHTML = '';

    setTimeout(() => {
      //iniciamos finalmenye
      this.swiperInit();
    }, 100);



  }

  //Carrusel sacado de https://swiperjs.com/get-started
  ngAfterViewInit(): void {
    this.swiperInit()
  }

  //reiniciamos el swiper para cuando se cargan imágenes
  swiperInit() {
    const element = this.swiperDiv().nativeElement;

    if (!element) return;
    console.log({ element });


    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,


      modules: [
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
