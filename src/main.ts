import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { ToastModule } from 'primeng/toast';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(ToastModule), 
    ...appConfig.providers
  ]
}).catch(err => console.error(err));

  