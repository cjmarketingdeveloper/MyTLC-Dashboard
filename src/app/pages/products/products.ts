import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Product } from '../../core/interface/product';
import {CommonModule, CurrencyPipe} from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product-service';
import { ProductCreateWidgetModal } from '../../widgets/modals/product-create-widget-modal/product-create-widget-modal';
import { CompanyWidgetModal } from '../../widgets/modals/company-widget-modal/company-widget-modal';
import { CategoriesWidgetModal } from '../../widgets/modals/categories-widget-modal/categories-widget-modal';
import { SpinnerService } from '../../core/services/spinner-service';
import { ProductImportListModal } from "../../widgets/modals/product-import-list-modal/product-import-list-modal";

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    CurrencyPipe,
    CompanyWidgetModal,
    CategoriesWidgetModal,
    ProductCreateWidgetModal,
    ProductImportListModal
],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  private spinner        = inject(SpinnerService);
  private productService = inject(ProductService);
  private cdr            = inject(ChangeDetectorRef);

  products: Product[] = [];
  loading = false;

  showCompaniesModal = false;
  showCategoriesModal = false;
  showCreateProductModal = false;
  showImportProductModal = false;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.loading = true;
    this.spinner.show();
    this.productService.getProducts().subscribe({
      next: (response) => {
        console.log(response);
        this.products = response;
        this.loading = false;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  openCompaniesModal() {
    this.showCompaniesModal = true;
  }
  closeCompaniesModal(): void {
    this.showCompaniesModal = false;
  }

  openCategoriesModal() {
    this.showCategoriesModal = true;
  }
  closeCategoriesModal(): void {
    this.showCategoriesModal = false;
  }

  openImportProductModal() {
    this.showImportProductModal = true;
  }
  closeImportProductModal(): void {
    this.showImportProductModal = false;
    this.getProducts();
  }

  openCreateProductModal() {
    this.showCreateProductModal = true;
  }
  closeCreateProductModal(): void {
    this.showCreateProductModal = false;
    this.getProducts();
  }
  

}
