import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../../core/interface/category';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories-widget-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-widget-modal.html',
  styleUrl: './categories-widget-modal.css',
})
export class CategoriesWidgetModal {
  private productService = inject(ProductService);
  private toastr = inject(ToastrService);

  categories = signal<Category[]>([]);
  newCategoryName = signal<string>('');
  isLoading = signal<boolean>(false);

  @Output()
  close = new EventEmitter<void>();

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.productService.getCategories().subscribe({
      next: (data) => {
        console.log(data);
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onCreateCategory(): void {
    const name = this.newCategoryName().trim();
    if (!name) return;

    this.isLoading.set(true);
    this.productService.createCategory({ name }).subscribe({
      next: (created) => {
        this.categories.update(list => [...list, created]);
        this.newCategoryName.set('');
        this.toastr.success("Successfully created Category");
        this.isLoading.set(false);
      }
    });
  }

  onDeleteCategory(id: number): void {
    if (!confirm('Are you sure you want to delete this Category?')) return;

    this.productService.deleteCategory(id).subscribe({
      next: () => {
        this.categories.update(list => list.filter(c => c.id !== id));
        this.toastr.success("Successfully deleted Category");
      }
    });
  }

  closeModal(): void {
    this.close.emit();
  }
}
