import { Product } from '@/products/interfaces/product-interface';
import { Component, input } from '@angular/core';
import { ProductImagePipe } from "../../pipes/product-image.pipe";
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-table',
  imports: [ProductImagePipe, RouterLink],
  templateUrl: './product-table.html',
})
export class ProductTable {
  products = input.required<Product[]>();

}
