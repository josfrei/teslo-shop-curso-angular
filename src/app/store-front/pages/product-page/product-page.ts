import { Product } from '@/products/interfaces/product-interface';
import { Component, computed, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductsService } from '../../../products/services/products.service';
import { ProductCarrusel } from "@/products/components/product-carrusel/product-carrusel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarrusel],
  templateUrl: './product-page.html',
})
export class ProductPage {
  //para usar los parámetros usando la clave 'query'
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);
  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

//lo que hacemos es ponerle idSlug a this.productIsSlug
// para acortar luego a la hora de pasarlo a  getProductBy....
// y también es qeu si fuese dinámico, una señal que cambia, que se actualice le strema
  productResource = rxResource({
    params: () => ({idSlug: this.productIdSlug}),
    stream: ({ params }) => {
      return this.productService.getProductByIdSlug(params.idSlug)
    }
  });

  //rxResource

}
