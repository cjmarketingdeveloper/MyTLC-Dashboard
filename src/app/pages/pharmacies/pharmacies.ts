import { Component, inject } from '@angular/core';
import { SpinnerService } from '../../core/services/spinner-service';

@Component({
  selector: 'app-pharmacies',
  imports: [],
  templateUrl: './pharmacies.html',
  styleUrl: './pharmacies.css',
})
export class Pharmacies {
  private spinner = inject(SpinnerService);
}
