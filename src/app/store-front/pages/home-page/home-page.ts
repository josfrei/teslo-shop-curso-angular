import { ProductCard } from '@/products/components/product-card/product-card';
import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "@/shared/components/pagination-component/pagination-component";
import { PaginationService } from '@/shared/components/pagination-component/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, PaginationComponent],
  templateUrl: './home-page.html',
})
export class HomePage {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({
      pagina: this.paginationService.paginaActual() - 1 //porque empezamos en la página 0
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: params.pagina * 9
      });
    }
  })




}
