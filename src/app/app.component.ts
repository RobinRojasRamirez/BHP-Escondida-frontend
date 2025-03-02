import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AlertService } from './shared/services/alert.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    AlertService,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'BHR-Escondida-Frontend';

}

