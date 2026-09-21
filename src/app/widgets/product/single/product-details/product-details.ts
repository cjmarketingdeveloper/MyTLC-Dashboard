import { ChangeDetectorRef, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../../../../core/interface/product';
import { ProductService } from '../../../../core/services/product-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../../../core/services/spinner-service';
import { Router } from '@angular/router';
import { Company } from '../../../../core/interface/company';
import { Category } from '../../../../core/interface/category';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
   product = input.required<Product>();

   private productService = inject(ProductService);
   private cdr            = inject(ChangeDetectorRef);
   private toastr         = inject(ToastrService);
   private router         = inject(Router);

   loading = false;
   private spinner = inject(SpinnerService);
   
   isConfirmingDelete = false;
   isLoadingDelete = false;

  isSpinner = false;
  companies: Company[] = [];
  categories: Category[] = [];

  selectedCompanyId = signal<number | null>(null);
  selectedCategoryId = signal<number | null>(null);

  //////////////////////////////////////////////////////////
  // Temporary selection binding for radio inputs
  tempCompanyId: number | null = null;
  tempCategoryId: number | null = null;

  // Derived names for display
  categoryName = computed(() => 
    this.categories.find(c => c.id === this.selectedCategoryId())?.name || 'None selected'
  );

  companyName = computed(() => 
    this.companies.find(c => c.id === this.selectedCompanyId())?.name || 'None selected'
  );
  ngOnInit(): void {
    this.loadData();
  }


  loadData(): void {
      this.isSpinner =true;
      forkJoin({
        categories: this.productService.getCategories(),
        companies: this.productService.getCompanies()
      })
      .pipe(
        // finalize guarantees isLoading becomes false whether requests succeed or fail
        finalize(() => {
          this.isSpinner = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: ({ categories, companies }) => {
          this.categories = categories;
          this.companies = companies;
        },
        error: (err) => {
          console.error('Failed to load initial data', err);
        }
      });
  }
  
  updateCompany(): void {
    if (this.tempCompanyId !== null) {
      //this.selectedCompanyId.set(this.tempCompanyId);
      const productId = this.product()?.id;
      const companyId = this.tempCompanyId;

      if (!productId || companyId === null) {
        console.warn('Missing product ID or selected company ID.');
        return;
      }

      this.loading = true;
      this.productService.updateCompany(productId, companyId)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: (updatedProduct:any) => {
            // Update Signal state
            this.selectedCompanyId.set(companyId);

            console.log("[[[[[[[[[]]]]]]]]]]");
            console.log(updatedProduct);
            this.toastr.success(updatedProduct.message || "Successfully updated.")
            //this.product.set(updatedProduct.product);
            console.log('Company updated successfully to:', companyId);
          },
          error: (err) => {
            console.error('Failed to update company:', err);
            // Optional: Revert temp ID on failure
            this.tempCompanyId = this.selectedCompanyId();
          }
        });
    }
  }

  updateCategory(): void {
    if (this.tempCategoryId !== null) {
      //this.selectedCategoryId.set(this.tempCategoryId);
      
      const productId = this.product()?.id;
      const categoryId = this.tempCategoryId;

      if (!productId || categoryId === null) {
        console.warn('Missing product ID or selected category ID.');
        return;
      }

      this.loading = true;
      this.productService.updateCategory(productId, categoryId)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: (updatedProduct: any) => {
            // Update Signal state
            this.selectedCategoryId.set(categoryId);
            console.log(updatedProduct);

            /*
            // If product is a Signal holding the product object, update it directly
            if (typeof this.product === 'function' && 'set' in this.product) {
              this.product.set(updatedProduct);
            }
            */
            console.log(updatedProduct);
            this.toastr.success(updatedProduct.message || "Successfully updated.")
            console.log('Category updated successfully to:', categoryId);
          },
          error: (err) => {
            console.error('Failed to update category:', err);
            // Optional: Revert temp ID on failure
            this.tempCategoryId = this.selectedCategoryId();
          }
        });
    }
  }

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

  toggleDeleteConfirm(): void {
    this.isConfirmingDelete = !this.isConfirmingDelete;
  }
  
  deleteCurrentProduct(): void {
    const myProduct = this.product();
    if (!myProduct) return;
    
    this.loading = true;
    this.productService.deleteProductFull(myProduct.id).subscribe({
      next: () => {
        this.loading = false;
        this.isConfirmingDelete = false;
        this.toastr.success('Thank you. Your delete was successfully');
        this.router.navigate(['products']);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message || 'Failed to delete template', 'Error');
        this.cdr.detectChanges();
      }
    });
    
    /////////////////////////////////////
  }
   
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
}
