import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { Blog } from '../../core/interface/blog';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../core/services/spinner-service';
import { BlogService } from '../../core/services/blog-service';

@Component({
  selector: 'app-blog-single',
  imports: [FormsModule, QuillEditorComponent],
  templateUrl: './blog-single.html',
  styleUrl: './blog-single.css',
})
export class BlogSingle implements OnInit {

  private route = inject(ActivatedRoute);
  
  blog: Blog = {
      id: 0,
      title: '',
      slug: '',
      content: '',
      sub_title: '',
  };

  private blogService = inject(BlogService);
  private spinner = inject(SpinnerService);
  
  ngOnInit(){
      const id = this.route.snapshot.paramMap.get('id');
      if(id){
        this.fetchCurrentBlog(id);
      }        
  }
  
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
     

  fetchCurrentBlog(id: string){
      this.spinner.show();
      this.blogService.getBlog(id).subscribe({
            next:(respones)=>{
                this.blog = respones;
                this.spinner.hide();
            }
        });
  }

  onFileSelected(event: any, type: 'main' | 'secondary') {
      const file = event.target.files[0];
      if (type === 'main') {
        this.blog.main_image = file;
      } else {
        this.blog.second_image = file;
      }
    }
  
  uploadMainImg(){
  
    }

  uploadSecondImg(){
      
    }
  
  updateSaveBlog() {
      console.log('Blog saved:', this.blog);
      // send blog data to backend API
  }

  deleteCurrentBlog(){

  }
}
