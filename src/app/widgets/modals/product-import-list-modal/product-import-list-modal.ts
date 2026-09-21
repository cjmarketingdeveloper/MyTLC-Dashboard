import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../../core/interface/category';
import { Company } from '../../../core/interface/company';
import { Product, ProductType } from '../../../core/interface/product';
import { catchError, concat, concatMap, finalize, forkJoin, from, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VariationGroup } from '../../../core/interface/variationgroup';

@Component({
  selector: 'app-product-import-list-modal',
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './product-import-list-modal.html',
  styleUrl: './product-import-list-modal.css',
})
export class ProductImportListModal implements OnInit{
  
  products: Product[] = [];
  variationGroups: VariationGroup[] = [];

  defaultCategoryId: number | null = null;
  isInitializing = true;

  isLoading = false;  
  hasImportedProducts = false;
  errorMessage = '';
  bulkUploadOn = false;
  
  private productService = inject(ProductService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef)
  

  private readonly colourValues = new Set([
    'BLACK',
    'BLUE',
    'GREEN',
    'WHITE',
    'RED',
    'ORANGE',
    'YELLOW',
    'PINK',
    'PURPLE',
    'BROWN',
    'GREY',
    'GRAY',
    'CLEAR'
  ]);

  private readonly shapeValues = new Set([
    'ROUND',
    'SQUARE',
    'RECTANGLE',
    'OVAL',
    'TRIANGLE',
    'HEXAGON',
    'CIRCULAR'
  ]);

  private readonly flavourValues = new Set([
    'VANILLA',
    'CHOCOLATE',
    'STRAWBERRY',
    'MINT',
    'LEMON',
    'ORANGE',
    'APPLE',
    'GRAPE'
  ]);

  @Output()
  close = new EventEmitter<void>();

  ngOnInit(): void {
    this.fetchDefaultCategory();
  }

  /**
   * Fetch default category on initialization
   */
  private fetchDefaultCategory(): void {
    this.isInitializing = true;

    this.productService.getSmallestCategoryId().subscribe({
      next: (res) => {
        this.defaultCategoryId = res.smallestCategoryId;
        this.isInitializing = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isInitializing = false;
        this.errorMessage = 'Failed to load categories. Cannot import products.';
        this.toastr.error('Could not retrieve a valid default category.', 'Error');
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Called when the user selects the TXT file.
   */
  onFileSelected(event: Event): void {
    if (this.defaultCategoryId === null) {
      this.errorMessage = 'No default category available. Please refresh and try again.';
      return;
    }

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.name.toLowerCase().endsWith('.txt')) {
      this.errorMessage = 'Please select a TXT file.';
      return;
    }
    this.readFile(file);
  }

  /**
   * Read the text file.
   */
  private readFile(file: File): void {
    this.isLoading = true;
    this.errorMessage = '';

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = reader.result as string;
        
        this.parseFile(text);
       
        this.isLoading = false;
        this.cdr.detectChanges();

      } catch (error) {
        console.error('Error parsing product file:', error);

        this.products = [];
        this.variationGroups = [];
        this.errorMessage = 'There was an error reading the product file.';
        this.isLoading = false;
      }
    };

    reader.onerror = () => {
      this.products = [];
      this.variationGroups = [];
      this.errorMessage = 'Unable to read the selected file.';
      this.isLoading = false;
    };

    reader.readAsText(file);
  }

  /**
   * Parse the complete TXT file.
   */
  private parseFile(text: string): void {

    this.products = [];
    this.variationGroups = [];
    this.hasImportedProducts = false;

    const lines = text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    for (const line of lines) {
      const parts = line.split('|');

      if (parts.length < 4) {
        console.warn('Skipping invalid line:', line);
        continue;
      }

      const code = parts[0].trim();
      const title = parts[1].trim();
      const price = Number(parts[2].trim());
      const stockCount = Number(parts[3].trim());

      if (!code || !title) {
        continue;
      }

      /**
       * Skip deleted products.
       */
      if (title.toUpperCase().startsWith('DELETE')) {
        continue;
      }

      /**
       * Skip invalid numeric values.
       */
      if (Number.isNaN(price) || Number.isNaN(stockCount)) {
        console.warn('Skipping invalid product:', line);
        continue;
      }

      const product = this.createProduct(
        code,
        title,
        price,
        stockCount
      );
      this.products.push(product);
    }
    this.buildVariationGroups();
    // Import was successful if at least one product was parsed
    this.hasImportedProducts = this.products.length > 0;
    console.log('Imported products:', this.products);
    console.log('Variation groups:', this.variationGroups);
 
  }

  /**
   * Create a Product from one TXT row.
   */
  private createProduct(
    code: string,
    title: string,
    price: number,
    stockCount: number
  ): Product {

    const isTlc = title.toUpperCase().startsWith('TLC -');

    return {
      id: 0,
      // TLC products belong to company 2000.
      // Everything else belongs to company 2001.
      companyId: isTlc ? 2000 : 2001,
      categoryId: this.defaultCategoryId!,
      type: this.detectProductType(title),
      title,
      code,
      description: '',
      imageUrl: '',
      price,
      min_quantity: 1,
      stock_count: stockCount,
      show_stock: true,
      is_active: false
    };
  }

  /**
   * Detect the product type from the title.
   */
  private detectProductType(title: string): ProductType {
    const value = title.toLowerCase();
    if (value.includes('badge')) {
      return 'badge';
    }
    if (value.includes('stamp')) {
      return 'stamp';
    }
    if (value.includes('flyer')) {
      return 'flyer';
    }
    return 'standard';
  }

  /**
   * Find products that represent variations.
   */
  private buildVariationGroups(): void {
    this.variationGroups = [];

    /**
     * We first group products by price.
     *
     * Variation detection will then compare their titles
     * to determine whether they share a common base title.
     */
    const priceGroups = new Map<number, Product[]>();
    for (const product of this.products) {
      const existing = priceGroups.get(product.price) ?? [];
      existing.push(product);
      priceGroups.set(product.price, existing);
    }

    for (const [, products] of priceGroups) {
      if (products.length < 2) {
        continue;
      }
      this.findVariationGroups(products);
    }
  }

  /**
   * Find variation groups within products that have the same price.
   */
  private findVariationGroups(products: Product[]): void {

    const processed = new Set<string>();

    for (const product of products) {

      if (processed.has(product.code)) {
        continue;
      }

      /**
       * Find products that have the same title structure
       * and same price.
       */
      const potentialGroup = products.filter(other => {

        if (other.code === product.code) {
          return false;
        }

        return other.price === product.price;
      });

      if (potentialGroup.length === 0) {
        continue;
      }

      const allRelated = [
        product,
        ...potentialGroup
      ];

      const variation = this.getVariationInfo(
        product.title,
        allRelated
      );

      if (!variation) {
        continue;
      }

      /**
       * Find every product belonging to this exact variation.
       */
      const groupProducts = allRelated.filter(other => {

        const otherVariation = this.getVariationInfo(
          other.title,
          allRelated
        );

        if (!otherVariation) {
          return false;
        }

        return (
          otherVariation.label === variation.label &&
          this.normaliseTitle(otherVariation.baseTitle) ===
          this.normaliseTitle(variation.baseTitle)
        );
      });

      if (groupProducts.length < 2) {
        continue;
      }

      /**
       * ONE random identifier for this variation group.
       */
      const variationCode = this.generateVariationCode();

      /**
       * Apply variation information to every product.
       */
      for (const groupProduct of groupProducts) {

        const productVariation = this.getVariationInfo(
          groupProduct.title,
          groupProducts
        );

        if (!productVariation) {
          continue;
        }

        groupProduct.variation = variationCode;
        groupProduct.variation_label = productVariation.label;
        groupProduct.variation_value = productVariation.value;

        processed.add(groupProduct.code);
      }

      /**
       * Add the group.
       */
      this.variationGroups.push({
        variationCode,
        companyId: product.companyId,
        categoryId: product.categoryId,
        variationLabel: variation.label,
        variationValue: variation.value,
        products: groupProducts
      });
    }
  }

  private normaliseTitle(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }

  private getVariationInfo(
      title: string,
      relatedProducts: Product[]
    ): {
      baseTitle: string;
      label: string;
      value: string;
    } | null {

      const parts = title
        .split(' - ')
        .map(part => part.trim())
        .filter(Boolean);

      if (parts.length < 2) {
        return null;
      }

      const upperParts = parts.map(part => part.toUpperCase());

      /**
       * ---------------------------------------------------------
       * COLOUR
       * ---------------------------------------------------------
       *
       * Example:
       *
       * HAND BASKET - BLACK
       * HAND BASKET - BLUE
       * HAND BASKET - GREEN
       */
      const colourIndex = upperParts.findIndex(part =>
        this.colourValues.has(part)
      );

      if (colourIndex !== -1) {
        const hasDifferentColour = relatedProducts.some(other => {
          const otherParts = other.title
            .split(' - ')
            .map(part => part.trim().toUpperCase());

          return (
            otherParts.length === parts.length &&
            otherParts
              .filter((_, index) => index !== colourIndex)
              .join('|') ===
            upperParts
              .filter((_, index) => index !== colourIndex)
              .join('|') &&
            otherParts[colourIndex] !== upperParts[colourIndex]
          );
        });

        if (hasDifferentColour) {
          return {
            baseTitle: parts
              .filter((_, index) => index !== colourIndex)
              .join(' - '),

            label: 'Colour',

            value: parts[colourIndex]
          };
        }
      }

      /**
       * ---------------------------------------------------------
       * SHAPE
       * ---------------------------------------------------------
       *
       * Example:
       *
       * WIRE BIN - ROUND - WHITE
       * WIRE BIN - SQUARE - WHITE
       */
      const shapeIndex = upperParts.findIndex(part =>
        this.shapeValues.has(part)
      );

      if (shapeIndex !== -1) {

        const hasDifferentShape = relatedProducts.some(other => {

          const otherParts = other.title
            .split(' - ')
            .map(part => part.trim().toUpperCase());

          return (
            otherParts.length === parts.length &&
            otherParts
              .filter((_, index) => index !== shapeIndex)
              .join('|') ===
            upperParts
              .filter((_, index) => index !== shapeIndex)
              .join('|') &&
            otherParts[shapeIndex] !== upperParts[shapeIndex]
          );
        });

        if (hasDifferentShape) {
          return {
            baseTitle: parts
              .filter((_, index) => index !== shapeIndex)
              .join(' - '),

            label: 'Shape',

            value: parts[shapeIndex]
          };
        }
      }

      /**
       * ---------------------------------------------------------
       * FLAVOUR
       * ---------------------------------------------------------
       */
      const flavourIndex = upperParts.findIndex(part =>
        this.flavourValues.has(part)
      );

      if (flavourIndex !== -1) {

        const hasDifferentFlavour = relatedProducts.some(other => {

          const otherParts = other.title
            .split(' - ')
            .map(part => part.trim().toUpperCase());

          return (
            otherParts.length === parts.length &&
            otherParts
              .filter((_, index) => index !== flavourIndex)
              .join('|') ===
            upperParts
              .filter((_, index) => index !== flavourIndex)
              .join('|') &&
            otherParts[flavourIndex] !== upperParts[flavourIndex]
          );
        });

        if (hasDifferentFlavour) {
          return {
            baseTitle: parts
              .filter((_, index) => index !== flavourIndex)
              .join(' - '),

            label: 'Flavour',

            value: parts[flavourIndex]
          };
        }
      }

      return null;
  }

  private generateVariationCode(): string {
    return Math.floor(
      10000000 + Math.random() * 90000000
    ).toString();
  }

  onSaveProcessProduct(): void {
      if (!this.products.length || this.isLoading) {
          return;
      }

      this.isLoading = true;
      this.bulkUploadOn = true;
      // Reset statuses
      this.products.forEach(product => {
          product.importStatus = 'pending';
          product.importError = undefined;
      });

      this.cdr.detectChanges();
      this.processProduct(0);
  }

  private processProduct(index: number): void {

      // Finished
      if (index >= this.products.length) {
          this.isLoading = false;
          this.cdr.detectChanges();
          console.log('[PRODUCT IMPORT] Finished');
          return;
      }

      const product = this.products[index];

      // Show processing immediately
      product.importStatus = 'processing';
      this.cdr.detectChanges();

      this.productService.createUpdadteProduct(product).subscribe({
          next: response => {

              console.log(
                  `[PRODUCT IMPORT] Complete: ${product.code}`,
                  response
              );

              product.importStatus = 'complete';
              this.cdr.detectChanges();
              // Next product
              this.processProduct(index + 1);
          },
          error: error => {
              console.error(
                  `[PRODUCT IMPORT] Failed: ${product.code}`,
                  error
              );
              product.importStatus = 'failed';
              product.importError =
                  error?.error?.message ||
                  error?.message ||
                  'Unable to save product';
              this.cdr.detectChanges();

              // IMPORTANT:
              // Continue processing the remaining products.
              this.processProduct(index + 1);
          }
      });
  }

 

  closeModal(): void {
    this.close.emit();
  }
}