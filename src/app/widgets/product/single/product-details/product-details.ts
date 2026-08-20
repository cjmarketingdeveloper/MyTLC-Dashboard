import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { Product } from '../../../../core/interface/product';
import { ProductService } from '../../../../core/services/product-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../../../core/services/spinner-service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
   product = input.required<Product>();

   private productService = inject(ProductService);
   private cdr            = inject(ChangeDetectorRef);
   private toastr = inject(ToastrService);

   loading = false;
   private spinner = inject(SpinnerService);
   
   saveChanges(): void {
      const product = this.product();

       const payload = {
          id: product.id,
          data: {
            title: product.title,
            description: product.description,
            price: product.price,
            min_quantity: product.min_quantity,
            stock_count: product.stock_count,
            show_stock: product.show_stock,
            is_active: product.is_active
          }
        };

      this.loading = true;
      this.spinner.show();
      this.productService.updateProductDetails(payload).subscribe({
        next: () => {
          this.loading = false;
          this.spinner.hide();
          this.toastr.success('Product updated successfully.');
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.toastr.error('Unable to update product.');
        }
    });

  }

   ////////////////////////
}
