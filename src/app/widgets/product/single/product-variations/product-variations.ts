import { Component, input } from '@angular/core';
import { Product } from '../../../../core/interface/product';

@Component({
  selector: 'app-product-variations',
  imports: [],
  templateUrl: './product-variations.html',
  styleUrl: './product-variations.css',
})
export class ProductVariations {
  product = input.required<Product>();
}
