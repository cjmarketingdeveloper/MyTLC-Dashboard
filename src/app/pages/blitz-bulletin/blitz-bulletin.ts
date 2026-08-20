import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlitzService } from '../../core/services/blitz-service';
import { Blitz } from '../../core/interface/blitz';
import { SpinnerService } from '../../core/services/spinner-service';

@Component({
  selector: 'app-blitz-bulletin',
  imports: [
    CommonModule,
    RouterLink,
    DatePipe  
  ],
  templateUrl: './blitz-bulletin.html',
  styleUrl: './blitz-bulletin.css',
})
export class BlitzBulletin implements OnInit {

  private spinner         = inject(SpinnerService);
  private blitzService    = inject(BlitzService);
  private cdr             = inject(ChangeDetectorRef);

  blitzs: Blitz[] = [];

  ngOnInit(): void {
    this.getBlitzList();
  }

  getBlitzList(): void {

    this.spinner.show();
    this.blitzService.getBlitzs().subscribe({
      next: (response) => {
        this.blitzs = response;

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
