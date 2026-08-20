import { Component, inject } from '@angular/core';
import { SpinnerService } from '../../core/services/spinner-service';

@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private spinner = inject(SpinnerService);
}
