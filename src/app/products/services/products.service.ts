import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse } from '../interfaces/product-interface';
import { delay, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private hhtp = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>(); // CACHÉ para productos
  private productCache = new Map<string, Product>(); //CACHÉ para producto individual

  /**
   *
   * @param options Obtiene todos los productos
   * @returns
   */
  getProducts(options: Options): Observable<ProductsResponse> {

    const { limit = 9, offset = 0, gender = '' } = options;

    //CACHÉ
    const clave = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(clave)) {
      return of(this.productsCache.get(clave)!)
    }

    // fin CACHÉ

    return this.hhtp.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit: limit,
        offset: offset,
        gender: gender,
      }
    })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(clave, resp)), //guardamos en CACHÉ
      );
  }


  /**
   *
   * @param idSlug Busca la información de un producto por su id o slug
   * @returns
   */
  getProductByIdSlug(idSlug: string): Observable<Product> {

    //CACHÉ
    const clave = `${idSlug}`;

    if (this.productCache.has(clave)) {
      return of(this.productCache.get(clave)!)
    }

    // fin CACHÉ


    return this.hhtp
      .get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(
        tap((producto) => this.productCache.set(clave, producto)), //guardamos en CACHÉ
      );
  }

  /**
   *
   * @param options Obtiene los productso por genero.
   * @returns
   */
  getProductsByGender(genero: string): Observable<ProductsResponse> {


    return this.hhtp.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit: 9,
        offset: 0,
        gender: genero,
      }
    })
      .pipe(
        tap((resp) => console.log(resp))
      );
  }
}
