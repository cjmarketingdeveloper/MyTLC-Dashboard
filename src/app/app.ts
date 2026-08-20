import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Spinner } from './widgets/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('My TLC');
}
