import { Component, inject, input, signal } from '@angular/core';
import { Product } from '../../../../core/interface/product';
import { SpinnerService } from '../../../../core/services/spinner-service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../core/services/product-service';

@Component({
  selector: 'app-product-images',
  imports: [CommonModule],
  templateUrl: './product-images.html',
  styleUrl: './product-images.css',
})
export class ProductImages {
  product = input.required<Product>();
  private spinner = inject(SpinnerService);
  private toastr  = inject(ToastrService);
  private productService = inject(ProductService);
  
  previewUrl    = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  isDragging    = signal<boolean>(false);

  private readonly MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    // 1. Validate file type
    if (!file.type.startsWith('image/')) {
      this.toastr.error('Please upload a valid image file.', 'Invalid File');
      return;
    }

    // 2. Validate file size (2MB)
    if (file.size > this.MAX_SIZE_BYTES) {
      this.toastr.error('Image size must be 2 MB or less.', 'File Too Large');
      return;
    }

    // Store selected File object
    this.selectedFile.set(file);

    // 3. Generate preview URL
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  saveUploadPreview(): void {
    const file = this.selectedFile();
    if (!file) {
      this.toastr.warning('Please select an image to upload first.', 'No File Selected');
      return;
    }

    const product = this.product();
    
  
    this.spinner.show();
    this.productService.uploadImage(file, product.imageUrl || "", product.id.toString()).subscribe({
      next: () => {
        this.spinner.hide();
        this.toastr.success('Product image updated successfully!', 'Success');
        this.selectedFile.set(null); // Reset selection state
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err?.message || 'Failed to upload image.', 'Upload Error');
      }
    });
  }
  
  
}
