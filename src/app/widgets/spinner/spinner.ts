import { Component, inject } from '@angular/core';
import { SpinnerService } from '../../core/services/spinner-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner {
  public spinnerService = inject(SpinnerService);
}
