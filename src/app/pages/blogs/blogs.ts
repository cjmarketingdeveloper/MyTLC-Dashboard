import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Blog } from '../../core/interface/blog';
import { BlogService } from '../../core/services/blog-service';
import { SpinnerService } from '../../core/services/spinner-service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-blogs',
  imports: [
    CommonModule,
    RouterLink,
    DatePipe  
  ],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css',
})
export class Blogs implements OnInit {
    
  private spinner        = inject(SpinnerService);
  private blogService    = inject(BlogService);
  private cdr            = inject(ChangeDetectorRef);

  blogs: Blog[] = [];

  ngOnInit(): void {
    this.getBlogList();
  }

  getBlogList(): void {

    this.spinner.show();
    this.blogService.getBlogs().subscribe({
      next: (response) => {
        this.blogs = response;

        this.spinner.hide();
        //this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.spinner.hide();
      }
    });

  }

}
