import { Component, inject } from '@angular/core';
import { SpinnerService } from '../../core/services/spinner-service';
import { BlitzService } from '../../core/services/blitz-service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';
import { Blitz } from '../../core/interface/blitz';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-blitz-bulletin-create',
  imports: [
    CommonModule,
    FormsModule, 
    QuillEditorComponent
  ],
  templateUrl: './blitz-bulletin-create.html',
  styleUrl: './blitz-bulletin-create.css',
})
export class BlitzBulletinCreate {
  
  private spinner       = inject(SpinnerService);
  private blitzService  = inject(BlitzService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private authService = inject(AuthService);
  
  blitz: Blitz = {
      id: 0,
      title: '',
      slug: '',
      sub_title: '',
      content: '',
      publish: true,
      author_id:"",
    };
  
  updateSlug() {
    this.blitz.slug = this.blitz.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
      .replace(/\s+/g, '-')           // replace spaces with dashes
      .replace(/-+/g, '-');           // collapse multiple dashes
  }

  editorModules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        ['code-block'], // toggle code
        [{ 'header': [1, 2, 3, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image']
      ]
  };
  
  saveBlitz() {

      ////////////
        if(!this.blitz.title){
          this.toastr.error("Please add title");
          return;
        }     
       
        const user = this.authService.currentUser();

        if (!user || !user.id) {
          this.toastr.error("User session not found. Please log in again.");
          return;
        }

        // Assign author_id dynamically
        this.blitz.author_id = user.id;
        this.spinner.show();
        this.blitzService.createBlitz(this.blitz).subscribe({
          next: (created) => {
            
            this.toastr.success("Successfully created blitz");
            this.spinner.hide();
            this.router.navigate(['/blitz-bulletin']);
          },
          error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error?.message || 'Invalid credentials')
          }
        });
        
      ////////////
  }
  
}
