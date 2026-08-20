import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { Blitz } from '../../core/interface/blitz';
import { BlitzService } from '../../core/services/blitz-service';
import { SpinnerService } from '../../core/services/spinner-service';

@Component({
  selector: 'app-blitz-bulletin-single',
  imports: [
    FormsModule, 
    QuillEditorComponent
  ],
  templateUrl: './blitz-bulletin-single.html',
  styleUrl: './blitz-bulletin-single.css',
})
export class BlitzBulletinSingle implements OnInit {
  private route = inject(ActivatedRoute);
  
  blitz: Blitz = {
      id: 0,
      title: '',
      slug: '',
      content: '',
  };

  private blitzService   = inject(BlitzService);
  private spinner        = inject(SpinnerService);
  
  ngOnInit(){
      const id = this.route.snapshot.paramMap.get('id');
      if(id){
        this.fetchCurrentBlitz(id);
      }        
  }
  
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

  fetchCurrentBlitz(id: string){
      this.spinner.show();
      this.blitzService.getBlitz(id).subscribe({
            next:(respones)=>{
                this.blitz = respones;
                this.spinner.hide();
            }
        });
  }

  onFileSelected(event: any, type: 'main') {
      const file = event.target.files[0];      
      this.blitz.main_image = file;
  }
  
  uploadMainImg(){
  
  }

  
  updateSaveBlitz() {
      console.log('Blitz saved:', this.blitz);
      // send blog data to backend API
  }

  deleteCurrentBlitz(){

  }

}
