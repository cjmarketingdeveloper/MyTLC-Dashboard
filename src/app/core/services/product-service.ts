import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../interface/product';
import { Company } from '../interface/company';
import { Category } from '../interface/category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  
  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(`${environment.apiUrl}products/list/v1`);
  }
  getProduct(id: string): Observable<Product>{
      return this.http.get<Product>(`${environment.apiUrl}products/find-single/v2/${id}`);
  }

  updateProductDetails(payload: any){
    return this.http.put(`${environment.apiUrl}products/update-details/v1`, payload);
  }

  createProduct(product: any) {
    return this.http.post(`${environment.apiUrl}products/create/item/v1`, product);
  }
  deleteProduct(id: number) {
    return this.http.delete(`${environment.apiUrl}products/delete/item/${id}`);
  }

  uploadImage(selectedImage: File, oldUrl: string, productId: string){
      const formData = new FormData();
      formData.append('productimage', selectedImage);
      formData.append('oldurl', oldUrl);
      formData.append('productid', productId);

      return this.http.put(`${environment.apiUrl}products/update/featured-image/v1`, formData);
  }
  /////////Company
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${environment.apiUrl}products/companies/v1`);
  }
  createCompany(companyData: Partial<Company>): Observable<Company> {
    return this.http.post<Company>(`${environment.apiUrl}products/create/company/v1`, companyData);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}products/company/${id}/v1`);
  }
  
  /////////Category
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}products/categories/v1`);
  }
  createCategory(categoryData: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${environment.apiUrl}products/create/category/v1`, categoryData);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}products/category/${id}/v1`);
  }
  //////////////////////////////

}
