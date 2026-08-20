import { ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Company } from '../../../core/interface/company';
import { Category } from '../../../core/interface/category';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-create-widget-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-create-widget-modal.html',
  styleUrl: './product-create-widget-modal.css',
})
export class ProductCreateWidgetModal {

  private productService = inject(ProductService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef)
  isLoading = false;
  isSpinner = false;

  companies: Company[] = [];
  categories: Category[] = [];

  product = {
    companyId: '',
    categoryId: '',
    type: 'standard',
    title: '',
    description: '',
    imageUrl: '',
    price: 0,
    minQuantity: 1,
    stockCount: 0,
    showStock: true,
    isActive: true
  };

  selectedCompanyId = signal<number | null>(null);
  selectedCategoryId = signal<number | null>(null);
  
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

  onCreateProduct(): void {
      if (!this.selectedCompanyId()) {
        this.toastr.warning('Please select a company.');
        return;
      }

      if (!this.selectedCategoryId()) {
        this.toastr.warning('Please select a category.');
        return;
      }

      const payload = {
        ...this.product,
        companyId: this.selectedCompanyId(),
        categoryId: this.selectedCategoryId()
      };

      this.isLoading = true;

      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.toastr.success('Product created successfully.');
          this.isLoading = false;
          this.close.emit();
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Unable to create product.');
        }
      });
  }

  onDeleteProduct(id: number): void {

  }


  closeModal(): void {
    this.close.emit();
  }
}
