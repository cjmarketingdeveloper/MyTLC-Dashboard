import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Blog } from '../interface/blog';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Blitz } from '../interface/blitz';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
   private http = inject(HttpClient);
  
  getLatestBlog():Observable<Blog>{
    return this.http.get<Blog>(`${environment.apiUrl}/dashboard/latest/blog/item/v1`);
  }
  getLatestBlitz():Observable<Blitz>{
    return this.http.get<Blitz>(`${environment.apiUrl}/dashboard/latest/blitz/item/v1`);
  }

  getTotalForDocuments():Observable<{ total: number }>{
    return this.http.get<{ total: number }>(`${environment.apiUrl}/dashboard/latest/documents-total/item/v1`);
  }
    
  getTotalForProducts():Observable<{ total: number }>{
    return this.http.get<{ total: number }>(`${environment.apiUrl}/dashboard/latest/products-total/item/v1`);
  }
    
}
