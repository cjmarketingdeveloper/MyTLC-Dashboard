import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { DocumentService } from '../../../core/services/document-service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface DocumentItem {
  file: File;
  title: string;
  description: string;
  category: string;
  type: string;
  sizeFormatted: string;
  isUploading: boolean;
  isUploaded: boolean;
  uploadedUrl?: string;
  error?: boolean;
}

@Component({
  selector: 'app-document-create-widget-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './document-create-widget-modal.html',
  styleUrl: './document-create-widget-modal.css',
})
export class DocumentCreateWidgetModal {
  private documentService = inject(DocumentService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef)
  isLoading = false;

  @Output()
  close = new EventEmitter<void>();

  documents: DocumentItem[] = [];
  isDragging = false;
  isBatchUploading = false;

  readonly MAX_FILES = 10;
  readonly MAX_SIZE_BYTES = 35 * 1024 * 1024;
  // Define allowed extensions and MIME types
  readonly ALLOWED_EXTENSIONS = [
    'pdf',
    'doc', 'docx', 'gdoc',
    'xls', 'xlsx', 'gsheet',
    'ppt', 'pptx', 'gslides',
    'gform',
    'csv'
  ];

  readonly ALLOWED_MIME_TYPES = [
    // PDF
    'application/pdf',
    // Word & Google Docs
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.google-apps.document',
    // Excel & Google Sheets
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.google-apps.spreadsheet',
    // PowerPoint & Google Slides
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.google-apps.presentation',
    // Google Forms
    'application/vnd.google-apps.form',
    // CSV
    'text/csv',
    'application/csv',
    'text/x-csv'
  ];

  closeModal(): void {
    this.close.emit();
  }

  // --- Drag & Drop Handlers ---
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
      input.value = ''; // Reset input selection
    }
  }

  // --- File Validation & Processing ---
  private handleFiles(incomingFiles: File[]): void {
    const availableSlots = this.MAX_FILES - this.documents.length;
    if (availableSlots <= 0) {
      this.toastr.warning(`You can only upload a maximum of ${this.MAX_FILES} documents at a time.`);
      return;
    }

    const filesToProcess = incomingFiles.slice(0, availableSlots);

    filesToProcess.forEach((file) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

      // 1. Validate File Extension & MIME type
      const isExtensionAllowed = this.ALLOWED_EXTENSIONS.includes(fileExtension);
      const isMimeAllowed = this.ALLOWED_MIME_TYPES.includes(file.type);

      if (!isExtensionAllowed && !isMimeAllowed) {
        this.toastr.error(`"${file.name}" is not an allowed file type.`);
        return;
      }

      // 2. Validate File Size (35 MB limit)
      if (file.size > this.MAX_SIZE_BYTES) {
        this.toastr.error(`"${file.name}" exceeds the 35 MB size limit.`);
        return;
      }

      const defaultTitle = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

      this.documents.push({
        file,
        title: defaultTitle,
        description: '',
        category: '',
        type: fileExtension || 'document',
        sizeFormatted: this.formatBytes(file.size),
        isUploading: false,
        isUploaded: false,
      });
    });

    this.cdr.markForCheck();
  }

  removeDocument(index: number): void {
    this.documents.splice(index, 1);
  }

  // --- Upload Operations ---
  async uploadSingle(doc: DocumentItem): Promise<boolean> {
    if (!doc.title.trim() || doc.isUploading || doc.isUploaded) {
      return false;
    }

    doc.isUploading = true;
    doc.error = false;
    this.cdr.markForCheck();

    return new Promise((resolve) => {
      this.documentService
        .uploadDocument(doc.file, doc.title.trim(), doc.description, doc.category, doc.type, doc.sizeFormatted)
        .subscribe({
          next: (res: any) => {
            doc.isUploading = false;
            doc.isUploaded = true;
            // Adapts to API returning either standard response object or direct string URL
            doc.uploadedUrl = res?.document?.file_path || res?.url || res?.path || res;
            this.toastr.success(`Uploaded "${doc.title}" successfully.`);
            this.cdr.markForCheck();
            resolve(true);
          },
          error: (err) => {
            doc.isUploading = false;
            doc.error = true;
            this.toastr.error(`Failed to upload "${doc.title}".`);
            this.cdr.markForCheck();
            resolve(false);
          },
        });
    });
  }

  async uploadAll(): Promise<void> {
    this.isBatchUploading = true;

    for (const doc of this.documents) {
      if (!doc.isUploaded && doc.title.trim()) {
        await this.uploadSingle(doc);
      }
    }

    this.isBatchUploading = false;
    this.cdr.markForCheck();
  }

  copyToClipboard(url?: string): void {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      this.toastr.info('Image URL copied to clipboard!');
    });
  }

  // Helper for human-readable file sizes (B, KB, MB)
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
  
}
