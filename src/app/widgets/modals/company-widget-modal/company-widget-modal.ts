import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product-service';
import { Company } from '../../../core/interface/company';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-widget-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './company-widget-modal.html',
  styleUrl: './company-widget-modal.css',
})
export class CompanyWidgetModal {
  private productService = inject(ProductService);
  private toastr = inject(ToastrService);

  companies = signal<Company[]>([]);
  newCompanyName = signal<string>('');
  isLoading = signal<boolean>(false);

  @Output()
  close = new EventEmitter<void>();

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading.set(true);
    this.productService.getCompanies().subscribe({
      next: (data) => {
        this.companies.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onCreateCompany(): void {
    const name = this.newCompanyName().trim();
    if (!name) return;

    this.isLoading.set(true);
    this.productService.createCompany({ name }).subscribe({
      next: (created) => {
        this.companies.update(list => [...list, created]);
        this.newCompanyName.set('');
        this.toastr.success("Successfully created company");
        this.isLoading.set(false);
      }
    });
  }

  onDeleteCompany(id: number): void {
    if (!confirm('Are you sure you want to delete this company?')) return;

    this.productService.deleteCompany(id).subscribe({
      next: () => {
        this.companies.update(list => list.filter(c => c.id !== id));
        this.toastr.success("Successfully deleted company");
      }
    });
  }

  closeModal(): void {
    this.close.emit();
  }

  
}
