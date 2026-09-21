import { Component, inject, input, signal, effect } from '@angular/core';
import { Product } from '../../../../core/interface/product';
import { ProductService } from '../../../../core/services/product-service';
import { VariationGroup } from '../../../../core/interface/variationgroup';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-variations',
  imports: [CommonModule],
  templateUrl: './product-variations.html',
  styleUrl: './product-variations.css',
})
export class ProductVariations {
  product = input.required<Product>();
  private productService = inject(ProductService);
  variationGroup = signal<VariationGroup | null>(null);

  isLoading   = signal<boolean>(false);
  hasError    = signal<boolean>(false);

  constructor() {
    // Automatically re-fetches whenever product() input updates
    effect(() => {
      const currentProduct = this.product();
      if (currentProduct?.id) {
        this.fetchVariations(currentProduct.id);
      }
    });
    
  }

  private fetchVariations(productId: number): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.productService.getProductVariations(productId).subscribe({
      next: (data) => {
        this.variationGroup.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading variation group:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }
}
