import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Document } from '../interface/document';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private http = inject(HttpClient);
  
  uploadDocument(selectedImage: File, title: string, description: string,
      category:string, type: string, size: string
  ){
        const formData = new FormData();
        formData.append('documentfile', selectedImage);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('type', type);
        formData.append('size', size);
  
        return this.http.post(`${environment.apiUrl}/documents/upload/document-file/v1`, formData);
    }

  getDocuments():Observable<Document[]>{
      return this.http.get<Document[]>(`${environment.apiUrl}/documents/list/v1`);
  }

  getDocument(id: string): Observable<Document>{
          return this.http.get<Document>(`${environment.apiUrl}/documents/find-single/v2/${id}`);
  }

}
