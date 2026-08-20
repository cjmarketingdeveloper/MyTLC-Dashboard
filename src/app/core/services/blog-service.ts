import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../interface/blog';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private http = inject(HttpClient);
  
  getBlogs():Observable<Blog[]>{
    return this.http.get<Blog[]>(`${environment.apiUrl}/blogs/list/v1`);
  }

  getBlog(id: string): Observable<Blog>{
      return this.http.get<Blog>(`${environment.apiUrl}/blogs/find-single/v1/${id}`);
  }

  updateBlogDetails(payload: any){
    return this.http.put(`${environment.apiUrl}/blogs/update-details/v1`, payload);
  }

  createBlog(blog: any) {
    return this.http.post(`${environment.apiUrl}/blogs/create/blog-post/v1`, blog);
  }
  
  deleteBlog(id: number) {
    return this.http.delete(`${environment.apiUrl}/blogs/delete/item/${id}`);
  }

}
