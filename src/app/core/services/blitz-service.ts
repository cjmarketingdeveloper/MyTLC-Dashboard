import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blitz } from '../interface/blitz';

@Injectable({
  providedIn: 'root',
})
export class BlitzService {
   private http = inject(HttpClient);
  
  getBlitzs():Observable<Blitz[]>{
    return this.http.get<Blitz[]>(`${environment.apiUrl}/blitz/list/v1`);
  }

  getBlitz(id: string): Observable<Blitz>{
      return this.http.get<Blitz>(`${environment.apiUrl}/blitz/find-single/v1/${id}`);
  }

  updateBlitzDetails(payload: any){
    return this.http.put(`${environment.apiUrl}/blitz/update-details/v1`, payload);
  }

  createBlitz(blitz: any) {
    console.log(blitz);
    return this.http.post(`${environment.apiUrl}/blitz/create/blitz-post/v1`, blitz);
  }
  
  deleteBlitz(id: number) {
    return this.http.delete(`${environment.apiUrl}/blitz/delete/item/${id}`);
  }

}
