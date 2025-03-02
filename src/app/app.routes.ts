import { Routes } from '@angular/router';
import { AppLayout } from './shared/layout/component/app.layout';
import { LoginComponent } from './modules/login/UI/pages/form-login/form-login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { GuestGuard } from './shared/guards/guest.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
    {
      path: '',
      component: AppLayout,
      canActivate: [AuthGuard],
      children: [
        { 
          path: 'dashboard', 
          loadComponent: () =>
            import('./modules/dashboard/dashboard.component')
              .then((m) => m.DashboardComponent)
        },
        { 
          path: 'bhp-bot', 
          loadComponent: () => import('./modules/bhp-bot/bhp-bot.component')
            .then((m) => m.BhpBotComponent) 
        }
      ]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard' }
  ];








