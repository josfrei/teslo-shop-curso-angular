import { ProductsService } from '@/products/services/products.service';
import { I18nSelectPipe, I18nPluralPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductCard } from "@/products/components/product-card/product-card";
import { PaginationComponent } from '@/shared/components/pagination-component/pagination-component';
import { PaginationService } from '@/shared/components/pagination-component/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [
    ProductCard,
    I18nSelectPipe,
    PaginationComponent,
  ],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  route = inject(ActivatedRoute);

  gender = toSignal(
    this.route.params.pipe(
      map(({ gender }) => gender)
    )
  )

  productsResource = rxResource({
    params: () => ({
      gender: this.gender(),
      pagina: this.paginationService.paginaActual() - 1 //porque empieza en 0
      }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        gender: params.gender,
        offset: params.pagina * 9
      })
    }
  })

  genderTipo = {
    "men": "Hombre",
    "women": "Mujer",
    "kids": "Joven"
  }



}
