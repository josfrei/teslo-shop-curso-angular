import { Product } from '@/products/interfaces/product-interface';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ProductCarrusel } from "@/products/components/product-carrusel/product-carrusel";
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { FormUtils } from '@/utils/form-utils';
import { FormErrorLabel } from "@/shared/components/form-error-label/form-error-label";
import { ProductsService } from '@/products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'component-product-details',
  imports: [ProductCarrusel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {

  producto = input.required<Product>();
  productsService = inject(ProductsService);
  productoGuardado = signal(false);
  tempImagenes = signal<string[]>([]);
  imagenesFileList: FileList | undefined = undefined;


  //juntamos las imagenes temporales con las que ya había
  imagenesCarrusel = computed(()=>{
    const imagenesProductoActual = [...this.producto().images, ...this.tempImagenes()];

    return imagenesProductoActual;

  })

  router = inject(Router);
  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    tags: [''],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kids|unisex/)]]
  });



  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL',];

  ngOnInit(): void {
    this.setFormValue(this.producto());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.producto() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
    //    this.productForm.patchValue(formLike as any);

  }

  /**
   * Lo que hacemos es añadir o quitar las tallas clicadas.
   * @param talla
   */
  tallaClicada(talla: string) {
    const tallasActuales = this.productForm.value.sizes ?? [];

    if (tallasActuales.includes(talla)) {
      tallasActuales.splice(tallasActuales.indexOf(talla), 1);
    } else {
      tallasActuales.push(talla);
    }

    this.productForm.patchValue({ sizes: tallasActuales });
  }


  async onSubmit() {
    const esValido = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!esValido) {
      return
    }

    const valoresDelFormulario = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(valoresDelFormulario as any),
      tags: valoresDelFormulario.tags
        ?.toLowerCase().split(',').map(tag => tag.trim()) ?? []
    };

    //comprobamos si es producto nuevo o si ya existía
    if (this.producto().id === 'new') {
      const producto = await firstValueFrom(
        this.productsService.crearProducto(productLike)
      )
      //creamos el producto
      this.router.navigate(['/admin/products', producto.id]);

    } else {
      await firstValueFrom(
        this.productsService.actualizarProducto(this.producto().id, productLike)
      )
    }

    this.productoGuardado.set(true);
    setTimeout(() => {
      this.productoGuardado.set(false)
    }, 3000)
  }


  //manejo de imágenes
  onFilesChanged(evento: Event) {
    const archivosList = (evento.target as HTMLInputElement).files;
    this.imagenesFileList = archivosList ?? undefined;

    this.tempImagenes.set([]);

    //así recibimos una url
    const urlImagen = Array.from(archivosList ?? []).map(archivo =>
      URL.createObjectURL(archivo)
    );

    this.tempImagenes.set(urlImagen);


  }
}
