import { Component, inject, signal } from '@angular/core';
import { ProductTable } from "@/products/components/product-table/product-table";
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination-component/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "@/shared/components/pagination-component/pagination-component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {

  //obtenemos los productos
  private productsService = inject(ProductsService);

  //paginacion
  paginationService = inject(PaginationService);

  //escoger el número de elementos mostrados
  productosPorPagina = signal(10);

  //organizamos los productso con la paginacion
  productsResource = rxResource({
    params: () => ({
      pagina: this.paginationService.paginaActual() - 1, //porque empezamos en la página 0
      limite: this.productosPorPagina()
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: params.pagina * 9,
        limit:params.limite
      });
    }
  })


}
