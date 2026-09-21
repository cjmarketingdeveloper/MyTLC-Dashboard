import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../interface/product';
import { Company } from '../interface/company';
import { Category } from '../interface/category';
import { VariationGroup } from '../interface/variationgroup';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  
  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(`${environment.apiUrl}/products/list/v1`);
  }
  getProduct(id: string): Observable<Product>{
      return this.http.get<Product>(`${environment.apiUrl}/products/find-single/v2/${id}`);
  }

  updateProductDetails(payload: any){
    return this.http.put(`${environment.apiUrl}/products/update-details/v1`, payload);
  }

  createProduct(product: any) {
    return this.http.post(`${environment.apiUrl}/products/create/item/v1`, product);
  }
  deleteProductFull(id: number) {
    return this.http.delete(`${environment.apiUrl}/products/delete/item/v2/${id}`);
  }

  uploadImage(selectedImage: File, oldUrl: string, productId: string){
      const formData = new FormData();
      formData.append('productimage', selectedImage);
      formData.append('oldurl', oldUrl);
      formData.append('productid', productId);

      return this.http.put(`${environment.apiUrl}/products/update/featured-image/v1`, formData);
  }
  createUpdadteProduct(product: any) {
    console.log(product);
    return this.http.post(`${environment.apiUrl}/products/create/item/v2`, product);
  }
  /////////Company
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${environment.apiUrl}/products/companies/v1`);
  }
  createCompany(companyData: Partial<Company>): Observable<Company> {
    return this.http.post<Company>(`${environment.apiUrl}/products/create/company/v1`, companyData);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/company/${id}/v1`);
  }
  
  updateCompany(productId: number | string, companyId: number | string): Observable<Product> {
    return this.http.patch<Product>(`${environment.apiUrl}/products/company/update/item/v1`, { productId, companyId });
  }

  getSmallestCategoryId(): Observable<{ smallestCategoryId: number }> {
    return this.http.get<{ smallestCategoryId: number }>(`${environment.apiUrl}/products/categories/smallest-id`);
  }
  
  /////////Category
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/products/categories/v1`);
  }
  createCategory(categoryData: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${environment.apiUrl}/products/create/category/v1`, categoryData);
  }

  updateCategory(productId: number | string, categoryId: number | string): Observable<Product> {
    return this.http.patch<Product>(`${environment.apiUrl}/products/category/update/item/v1`, { productId, categoryId });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/category/${id}/v1`);
  }
  //////////////////////////////
   getProductVariations(productId: number): Observable<VariationGroup> {
    return this.http.get<VariationGroup>(`${environment.apiUrl}/products/variations/list/${productId}/`);
  }
  ///////////////////////////////
}
