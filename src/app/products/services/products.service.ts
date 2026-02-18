import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductsResponse } from '../interfaces/product-interface';
import { delay, forkJoin, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '@/auth/interfaces/user.interface';
import { fileNamer } from '../../../../../10-nest-teslo-shop-backend/src/files/helpers/fileNamer.helper';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

// Producto vacío para la creación de un nuevo producto
const ProductoVacio: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Unisex,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

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

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
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


    return this.http
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


    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
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

  /**
   *
   * @param id
   */
  getProductById(id: string): Observable<Product> {

    if (id === 'new') {
      return of(ProductoVacio)
    }

    // empezamos comprobación de si está en caché
    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!)
    }

    // fin CACHÉ


    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(
        tap((producto) => this.productCache.set(id, producto)), //guardamos en CACHÉ
      );
  }

  crearProducto(producto: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products`, producto)
      .pipe(
        tap((productoCreado) => this.actualizarCacheProducto(productoCreado))
      )
  }



  /**
   * Actualizar producto
   */
  actualizarProducto(id: string, productLike: Partial<Product>): Observable<Product> {

    return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe(
        tap((productoActualizado) => this.actualizarCacheProducto(productoActualizado))
      )
  }




  /**
   * Actualizamos el caché.
   * @param producto
   */
  actualizarCacheProducto(producto: Product) {
    const productoId = producto.id;

    this.productCache.set(productoId, producto);

    //ahora actualizamos el producto en la paginación
    //recorremos el map del caché buscando por todas las páginas
    //si el id del producto que recorremos coincide con el que tenemos, entonces actualizamos los datos
    //sino, se mantiene el producto que estamos recorriendo
    this.productsCache.forEach(productosResponse => {
      productosResponse.products = productosResponse.products.map(
        (productoActual) => productoActual.id === productoId ? producto : productoActual
      )
    });
    console.log('Caché actualizado')
  }

  //obtenemos el fileList y lo subimos
  subidaImagenes(imagenes?: FileList): Observable<string[]> {
    //si no hay imagenes devolvemos [] vacio
    if(!imagenes)return of ([]);

    const subidaObservables = Array.from(imagenes).map((imagenFile) => this.subidaImagen(imagenFile));

    return forkJoin(subidaObservables).pipe(
      tap((nombresImagenes) => console.log({nombresImagenes}))
    )

  }

  subidaImagen(imagen: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imagen);

    return this.http.post<{fileName: string}>(`${baseUrl}/files/product`,formData)
    .pipe(
      map((resp) => resp.fileName)
    )
  }
}
