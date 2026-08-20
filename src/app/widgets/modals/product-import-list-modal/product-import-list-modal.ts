import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../../core/interface/category';
import { Company } from '../../../core/interface/company';
import { Product, ProductType } from '../../../core/interface/product';
import { finalize, forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-import-list-modal',
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './product-import-list-modal.html',
  styleUrl: './product-import-list-modal.css',
})
export class ProductImportListModal {
  
  private productService = inject(ProductService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef)
  isLoading = false;
   
  selectedFile: File | null = null;
  products: Product[] = [];

  companies: Company[] = [];
  categories: Category[] = [];
  isSpinner = false;

  @Output()
  close = new EventEmitter<void>();

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
          console.log(this.categories);
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

  get canSave(): boolean {
    if (this.products.length === 0) {
      return false;
    }

    return this.products.every(product => {
      if (!product.is_active) {
        return true;
      }

      return (
        product.companyId > 0 &&
        product.categoryId > 0
      );
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0]; 
   
     //show table after selecting 
    this.onProcessTable();
  }

  onProcessTable(): void {
     if (!this.selectedFile) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;

        const lines = text
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line.length > 0);

          this.products = lines.map(line => {

            const parts = line.split('|');

            let title = parts[1].trim();
            let isActive = true;
            let variation = "";

            // DELETE
            if (title.toUpperCase().startsWith('DELETE')) {
              isActive = false;
              title = title.replace(/^DELETE\s*/i, '').trim();
            }

            // Default company
            let companyId = 0;

            if (title.toUpperCase().startsWith('TLC -')) {
              title = title.replace(/^TLC\s*-\s*/i, '');
              const company = this.companies.find(
                c => c.name?.toLowerCase() === 'the local choice'
              );
              companyId = company?.id ?? 0;
            } else {
              const company = this.companies.find(
                c => c.name?.toLowerCase() === 'cj marketing'
              );

              companyId = company?.id ?? 0;
            }

            // Variation
            variation: 'standard';
            let variationValue = '';
            const index = title.lastIndexOf(' - ');
            if (index > -1) {

              variationValue = title.substring(index + 3).trim();
              title = title.substring(0, index).trim();
              variation = 'variation';
            }

            return {
              id: 0,
              companyId,
              categoryId: 0,
              type: 'standard',
              title,
              code: parts[0].trim(),
              description: '',
              imageUrl: '',
              variation,
              price: Number(parseFloat(parts[2]).toFixed(2)),
              min_quantity: 1,
              stock_count: parseInt(parts[3], 10),
              show_stock: true,
              is_active: isActive,
              variation_value: variationValue
            } as Product;
          });
        this.cdr.detectChanges();
      };
      reader.readAsText(this.selectedFile);
  }

  onSaveProcessProduct(): void {
    console.log("  [PRODUCTS]  ");
    console.log(this.products);
  }

  closeModal(): void {
    this.close.emit();
  }
}
