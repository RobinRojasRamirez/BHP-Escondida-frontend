import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ICols } from '../../../../../shared/interfaces/cols.interface';
import { TableLazyLoadEvent, TableModule } from 'primeng/table'
import { IParamsTable } from '../../../../../shared/interfaces/params-table.interface';
import { lastValueFrom } from 'rxjs';
import transform from '../../../../../shared/utils/filter-table.transform';
import { UsersService } from '../../../services/users.service';
import { Menu, MenuModule } from 'primeng/menu'
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag'
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormUsersComponent } from '../form-users/form-users.component';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ITableUsers } from '../../../interfaces/table-users.interface';

@Component({
  selector: 'app-index-users',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    TableModule,
    TagModule,
    InputTextModule,
    InputIconModule,
    ConfirmDialogModule,
    FormUsersComponent
  ],
  providers: [ ConfirmationService ],
  templateUrl: './index-users.component.html',
  styleUrl: './index-users.component.css'
})
export class IndexUsuariosComponent {

  rowSize: number = 10
  totalRecords: number = 0

  iParamsTable!: IParamsTable<null>
  loadingTable: boolean = false
  displayModal: boolean = false

  listsUsers: ITableUsers[] = []
  selectedId: number | null = null
  
  cols: ICols[] = [
    { field: 'name', header: 'Nombres', type: 'string', nameClass: 'text-left', order: true },
    { field: 'email', header: 'Correo electrónico', type: 'string', nameClass: 'text-left', minWidth: '100px', order: true },
    { field: 'role', header: 'Rol', type: 'string', nameClass: 'text-left', minWidth: '100px', order: true },
    { field: 'active', header: 'Activo', type: 'tag-1', nameClass: 'text-center', minWidth: '100px', order: true },
    { field: 'actions', header: 'Acciones', type: 'actions', nameClass: 'text-center', minWidth: '100px', order: false },
  ];

  menuItems = [
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => {
        this.edit(this.selectedId || null);
      }
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => {
        this.delete(this.selectedId || null);
      }
    }
  ];

  constructor(
    private readonly _usersService: UsersService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _alertService: AlertService,
  ) {
    
  }

  async delete(id: number | null): Promise<void> {
    this._confirmationService.confirm({
      message: '¿Quieres eliminar este registro?',
      header: 'Eliminar usuario',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        const response = await lastValueFrom(
          this._usersService.deleteUser(id)
        ).catch((response) => {
          this._alertService.showError('Mensaje del sistema', response.error.message)
        })
        if ( response ) {
          this.loadTable()
          this._alertService.showSuccess('Mensaje del sistema', response.message)
        }
      },
    })
  }

  showModal() {
    this.displayModal = true
  }

  openMenu(event: Event, menu: Menu, id: string | null) {
    this.selectedId = Number(id);
    menu.toggle(event);
  }

  edit(id: number | null) {
    this.displayModal = true
    this.selectedId = id || null
  }


  async loadTable(lazyLoadEvent: TableLazyLoadEvent = {}): Promise<void> {
    try {
      this.loadingTable = true
      this.iParamsTable = transform(lazyLoadEvent, this.rowSize)
      this.iParamsTable.params = null
      const response = await lastValueFrom(
        this._usersService.getUsersTable(this.iParamsTable)
      )
      const data = response.data
      this.listsUsers = data.content
      this.totalRecords = data.totalElements
      this.loadingTable = false
    } catch (error) {
      this.loadingTable = false
      this.listsUsers = []
      this.totalRecords = 0
    }
  }

  getSeverity(active: boolean | number): 'success' | 'danger' | 'info' {
    active = Number(active) === 1 ? true : false
    switch (active) {
      case true:
        return 'success';
      case false:
        return 'danger';
      default:
        return 'info';
    }
  }

  refreshData(hide = false) {
    this.displayModal = hide
    this.selectedId = null
    this.loadTable()
  }


}
