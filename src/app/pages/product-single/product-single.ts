import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product-service';
import { Product } from '../../core/interface/product';
import { ProductVariations } from '../../widgets/product/single/product-variations/product-variations';
import { ProductImages } from '../../widgets/product/single/product-images/product-images';
import { ProductDetails } from '../../widgets/product/single/product-details/product-details';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../core/services/spinner-service';

@Component({
  selector: 'app-product-single',
  imports: [
    CommonModule,
    ProductDetails,
    ProductImages, 
    ProductVariations
  ],
  templateUrl: './product-single.html',
  styleUrl: './product-single.css',
})
export class ProductSingle implements OnInit{

    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    product = signal<Product | null>(null);
    loading = signal(true);
    selectedTab = signal('details');
    private spinner = inject(SpinnerService);
    
    ngOnInit(){
      const id = this.route.snapshot.paramMap.get('id');
      if(id){
        this.fetchCurrentProduct(id);
      }        
    }

    fetchCurrentProduct(id: string){
      this.spinner.show();
      this.productService.getProduct(id).subscribe({
          next:(product)=>{
              console.log(product);
              this.product.set(product);
              this.loading.set(false);
              this.spinner.hide();
          }
        });
    }
}
