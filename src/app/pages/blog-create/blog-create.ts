import { Component, inject } from '@angular/core';
import { Blog } from '../../core/interface/blog';
import { QuillEditorComponent } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../core/services/blog-service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../core/services/spinner-service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-blog-create',
  imports: [
    CommonModule,
    FormsModule, 
    QuillEditorComponent],
  templateUrl: './blog-create.html',
  styleUrl: './blog-create.css',
})
export class BlogCreate {

  private spinner = inject(SpinnerService);
  private blogService = inject(BlogService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private authService = inject(AuthService);
  
  blog: Blog = {
      id: 0,
      title: '',
      slug: '',
      content: '',
      tags: '',
      publish: true,
      author_id:"",
    };
  
  updateSlug() {
    this.blog.slug = this.blog.title
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
  
  tagArray: string[] = [];
  newTag: string = '';

  addTag() {
    if (this.newTag.trim()) {
      this.tagArray.push(this.newTag.trim());
      this.syncTags();
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.tagArray.splice(index, 1);
    this.syncTags();
  }

  private syncTags() {
    // join array into comma-separated string
    this.blog.tags = this.tagArray.join(',');
  }

  saveBlog() {

      ////////////
        if(!this.blog.title){
          this.toastr.error("Please add title");
          return;
        }     
       
        const user = this.authService.currentUser();

        if (!user || !user.id) {
          this.toastr.error("User session not found. Please log in again.");
          return;
        }

        // Assign author_id dynamically
        this.blog.author_id = user.id;
        this.spinner.show();
        this.blogService.createBlog(this.blog).subscribe({
          next: (created) => {
            
            this.toastr.success("Successfully created blog");
            this.spinner.hide();
            this.router.navigate(['/blogs']);
          },
          error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error?.message || 'Invalid credentials')
          }
        });
        
      ////////////
  }
  
}
