import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DocumentCreateWidgetModal } from "../../widgets/modals/document-create-widget-modal/document-create-widget-modal";
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../core/services/spinner-service';
import { Document } from '../../core/interface/document';
import { DocumentService } from '../../core/services/document-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-documents',
  imports: [
    CommonModule,
    DocumentCreateWidgetModal],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit {

  private spinner         = inject(SpinnerService);
  private documentService = inject(DocumentService);
  private cdr             = inject(ChangeDetectorRef);
  private toastr          = inject(ToastrService);

  documents: Document[] = [];
  loading = false;

  showDocumentCreateModal = false;
  
  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments(): void {
    this.loading = true;
    this.spinner.show();
    this.documentService.getDocuments().subscribe({
      next: (response) => {
        console.log(response);
        this.documents = response;
        this.loading = false;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  openCreateDocumentModal(){
      this.showDocumentCreateModal = true;
  }
  closeCreateDocumentModal(): void {
    this.showDocumentCreateModal = false;
    this.getDocuments();
  }

  async copyToClipboard(url?: string){
    if (!url) return false;

      try {
        // Modern Clipboard API (Requires HTTPS or localhost)
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
          console.log('Copied to clipboard:', url);
          this.toastr.success("URL copied clipboard");
          return true;
        }

        // Fallback for legacy browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = url;
        
        // Position off-screen to avoid visual jump
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          console.log('Copied to clipboard (fallback):', url);
          this.toastr.success("URL copied clipboard");
          return true;
        }
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    return false;
  }
}
