import { Component } from '@angular/core';
import transform from '../../../../../shared/utils/filter-table.transform';
import { lastValueFrom } from 'rxjs';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InstructionsService } from '../../../services/instructions.service';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ICols } from '../../../../../shared/interfaces/cols.interface';
import { IParamsTable } from '../../../../../shared/interfaces/params-table.interface';
import { Menu, MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-instructions',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    TableModule,
    TagModule,
    InputTextModule,
    InputIconModule,
    ConfirmDialogModule,
  ],
  templateUrl: './index-instructions.component.html',
  styleUrl: './index-instructions.component.css'
})
export class IndexInstructionsComponent {

    rowSize: number = 10
    totalRecords: number = 0
  
    iParamsTable!: IParamsTable<null>
    loadingTable: boolean = false
  
    listsInstruction: any[] = []
    users: any[] = []
    selectedId: number | null = null
    
    cols: ICols[] = [
      { field: 'name', header: 'Nombres', type: 'string', nameClass: 'text-left', order: true },
      { field: 'url', header: 'Url', type: 'string', nameClass: 'text-left', minWidth: '100px', order: true },
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
      private readonly _instructionsService: InstructionsService,
      private readonly _confirmationService: ConfirmationService,
      private readonly _alertService: AlertService,
      private readonly _router: Router,
    ) {
    }
  
    async delete(id: number | null): Promise<void> {
      this._confirmationService.confirm({
        message: '¿Quieres eliminar este registro?',
        header: 'Eliminar instructivo',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        accept: async () => {
          const response = await lastValueFrom(
            this._instructionsService.deleteInstruction(id)
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
      this._router.navigate(['/instructions/create']);
    }
  
    openMenu(event: Event, menu: Menu, id: string | null) {
      this.selectedId = Number(id);
      menu.toggle(event);
    }
  
    edit(id: number | null): void {
      this._router.navigate(['/instructions/edit', id]);
    }
  
    async loadTable(lazyLoadEvent: TableLazyLoadEvent = {}): Promise<void> {
      try {
        this.loadingTable = true
        this.iParamsTable = transform(lazyLoadEvent, this.rowSize)
        this.iParamsTable.params = null
        const response = await lastValueFrom(
          this._instructionsService.getInstructionsTable(this.iParamsTable)
        )
        const data = response.data
        this.listsInstruction = data.content
        this.totalRecords = data.totalElements
        this.loadingTable = false
      } catch (error) {
        this.loadingTable = false
        this.listsInstruction = []
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

}
