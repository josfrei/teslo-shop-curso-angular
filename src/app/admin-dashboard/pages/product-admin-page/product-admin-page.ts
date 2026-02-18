import { ProductsService } from '@/products/services/products.service';
import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProductDetails } from "./product-details/product-details";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {
  //tomar la ruta activa
  activatedRoute = inject(ActivatedRoute);
  //redireccionar
  router = inject(Router);

  productService = inject(ProductsService);

  //tomo el id de la ruta
  productId = toSignal(
    this.activatedRoute.params.pipe(
      map(parametros => parametros['id'])
    )
  )

  productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }) => {
      return this.productService.getProductById(params.id)
    }
  })

  //Si cambia manualmente la url y no existe
  redirectEffect = effect(() => {

    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  })

}
