import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Blog } from '../../core/interface/blog';
import { DashboardService } from '../../core/services/dashboard-service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Blitz } from '../../core/interface/blitz';


@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{
  private dashboardService = inject(DashboardService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  isLoadingBlog   = false;
  isLoadingBlitz  = false;

  blogItem: Blog = {
    id : 0,
    title:"",
    slug:"",
    sub_title: "",
    main_image: "",  
  }

  blitzItem: Blitz = {
    id : 0,
    title:"",
    slug:"",
    sub_title: "",
    main_image: "",  
  }

  isLoadingTotalDoc   = false;
  isLoadingTotalProd  = false;
      
  totalDoc            = 0;
  totalProd           = 0;

  ngOnInit(){
    this.fetchDashBlogLatest(); 
    this.fetchDashBlitzLatest(); 

    this.fetchDashTotalDocuments();  
    this.fetchDashTotalProducts();          
  }

  fetchDashBlogLatest() {
    this.isLoadingBlog = true;

    this.dashboardService.getLatestBlog().subscribe({
      next:(blog)=>{
            this.blogItem = blog;
            this.isLoadingBlog  = false;
            this.cdr.detectChanges();
      },error: (err) => {
        this.isLoadingBlog = false;
        this.toastr.error(err.error?.message || 'Invalid credentials')
      }
    });
  }
    
  fetchDashBlitzLatest() {
    this.isLoadingBlog = true;

    this.dashboardService.getLatestBlitz().subscribe({
      next:(blitz)=>{
            this.blitzItem = blitz;
            this.isLoadingBlitz  = false;
            this.cdr.detectChanges();
      },error: (err) => {
        this.isLoadingBlitz = false;
        this.toastr.error(err.error?.message || 'Invalid credentials')
      }
    });
  }

  fetchDashTotalDocuments() {
    this.isLoadingTotalDoc = true;

    this.dashboardService.getTotalForDocuments().subscribe({
      next:(totalDoc)=>{
            this.totalDoc = totalDoc.total;
            this.isLoadingTotalDoc  = false;
            this.cdr.detectChanges();
      },error: (err) => {
        this.isLoadingTotalDoc = false;
        this.toastr.error(err.error?.message || 'Invalid credentials')
      }
    });
  }

  fetchDashTotalProducts() {
    this.isLoadingTotalProd = true;

    this.dashboardService.getTotalForProducts().subscribe({
      next:(totalProd)=>{
            this.totalProd = totalProd.total;
            this.isLoadingTotalProd  = false;
            this.cdr.detectChanges();
      },error: (err) => {
        this.isLoadingTotalProd = false;
        this.toastr.error(err.error?.message || 'Invalid credentials')
      }
    });
  }
  
}
