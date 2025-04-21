import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ButtonModule } from 'primeng/button';
import { LoginService } from '../../../modules/login/services/login.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast';
import { AlertService } from '../../services/alert.service';
@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
        CommonModule, 
        AppMenuitem, 
        RouterModule, 
        ButtonModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [
        MessageService,
        AlertService
    ],
    template: `
    <div class="layout-sidebar h-screen flex flex-col">
        <!-- Menú principal -->
        <ul class="layout-menu flex-1 overflow-auto">
            <!-- Logo -->
            <li class="menu-logo mb-5 mt-5">
                <img src="../../../../assets/images/logo-escondida.jpeg" width="100%" height="auto" class="h-10 mx-auto mt-3">
            </li>
            <!-- Items del menú -->
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    </div>
    <p-confirmDialog
    [breakpoints]="{ '960px': '75vw', '640px': '100vw' }"
    [style]="{ width: '25vw' }"
    [baseZIndex]="10000"
    rejectButtonStyleClass="p-button-danger"
    ></p-confirmDialog>
    `
})
export class AppMenu {

    model: MenuItem[] = []
    user: { id: number, userData: any } | null = null;

    constructor(
        private loginService: LoginService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private alertService: AlertService,
    ) {}

    async ngOnInit() {
        try {
            this.user = await this.loginService.getStoredUser();
        } catch (error) {
            this.alertService.showError('Error', 'No se pudo obtener los datos del usuario');
        }
        this.model = [
            {
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }]
            },
            {
                items: [{ label: 'BHP-BOT', icon: 'pi pi-fw pi-box', routerLink: ['/bhp-bot'] }]
            },
            {
                items: [
                    { 
                        label: 'Perfil', 
                        icon: 'pi pi-fw pi-user', 
                        items: [
                            { label: this.user?.userData.name, disabled: true, icon: 'pi pi-fw pi-minus' },
                            { label: 'Cargo', disabled: true, icon: 'pi pi-fw pi-minus' },
                            { label: 'Unidad', disabled: true, icon: 'pi pi-fw pi-minus' },
                            { label: `ID: ${this.user?.userData.id}`, disabled: true, icon: 'pi pi-fw pi-minus' }
                        ]
                    } 
                ]
            },
            {
                items: [{ label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/users'] }]
            },
            {
                items: [{ label: 'Instructivos', icon: 'pi pi-fw pi-receipt', routerLink: ['/instructions'] }]
            },
            {
                items: [{ label: 'Cerrar Sesión', icon: 'pi pi-fw pi-power-off text-red-400', command: () => this.logout() }]
            },
        ];
    }

    async logout() {
        this.confirmationService.confirm({
          message: '¿Estás seguro de que quieres cerrar sesión?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: async () => {
            try {
              await this.loginService.logout();
              this.alertService.showSuccess('Mensaje del sistema', 'Has cerrado sesión correctamente.');
              this.router.navigate(['/login']);
            } catch (error) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al cerrar sesión',
                detail: 'Inténtalo de nuevo más tarde.',
                life: 3000
              });
            }
          },
        });
    }

}
