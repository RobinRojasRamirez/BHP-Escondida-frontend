import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DropdownModule } from 'primeng/dropdown';
import { lastValueFrom } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { IUsersSave } from '../../../interfaces/users-save.interface';
import { AlertService } from '../../../../../shared/services/alert.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { HttpStatusCode } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { IRoleUsers } from '../../../interfaces/get-id-users.interface';
import { IListsRolesResponse } from '../../../interfaces/response-lists-roles.interface';

@Component({
  selector: 'app-form-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProgressSpinnerModule,
    DialogModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    ToggleSwitchModule,
    DropdownModule,
    InputGroupModule,
    InputGroupAddonModule,
    MultiSelectModule
  ],
  templateUrl: './form-users.component.html',
  styleUrl: './form-users.component.css'
})
export class FormUsersComponent {
  
  @Input() displayModal = false
  @Input() selectedId: number | null = 0 
  @Output() closeModal = new EventEmitter<boolean>()

  frmUsers!: FormGroup;
  listsRoles: IListsRolesResponse[] = []

  title: string = ''
  isLoading: boolean = false
  loading: boolean = false
  id: number = 0

  showPassword = true;

  constructor(
    private fb: FormBuilder,
    private readonly _usersService: UsersService,
    private readonly _alertService: AlertService,
  ) { }

  ngOnInit() {
    this.title = (this.selectedId && this.selectedId > 0) ? 'Actualizar usuario' : 'Crear usuario'
    this.loadingForm()
    this.loadListsRoles()
    this.prepareFormForCreate()
    if ( this.selectedId ) {
      this.loadUserId()
    }
  }

  loadingForm() {
    this.frmUsers = this.fb.group({
      id: [''],
      active: [true],
      name: ['', Validators.required],
      email: ['', Validators.required],
      roles: ['', Validators.required],
      password: [''],
    });
  }

  prepareFormForCreate() {
    this.frmUsers.get('password')?.setValidators(Validators.required);
    this.frmUsers.get('password')?.updateValueAndValidity();
  }

  async loadUserId() {
    const response = await lastValueFrom(this._usersService.getUserId(this.selectedId));
    if ( response && response.data ) {
      const user = response.data;
      const active = user.active === 1;
      const roleIds = user.roles?.map((role: IRoleUsers) => role.id) || [];
      this.frmUsers.patchValue({
        ...user,
        active,
        roles: roleIds,
      });
      this.frmUsers.get('password')?.clearValidators();
      this.frmUsers.get('password')?.updateValueAndValidity();
    }
  }

  hideModal(): void {
    this.displayModal = false
    this.closeModal.emit(false)
  }

  async loadListsRoles() {
    const response = await lastValueFrom(this._usersService.getListsRoles());
    if ( response && response.data ) {
      this.listsRoles = response.data.content
    }
  }

  transformData(): IUsersSave {
    const formValues = this.frmUsers.value;
    return {
      id: this.selectedId || null, 
      active: formValues.active === true ? 1 : 2,
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      role: formValues.roles, 
    };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if ( this.frmUsers.valid ) {
      const transformedData = this.transformData()
      try {
        const response = await lastValueFrom(this._usersService.createUser(transformedData));
        if( response.data && response.status === HttpStatusCode.Ok ) {
          this._alertService.showSuccess('Mensaje del sistema.', response.message || 'Usuario creado exitosamente');
          this.hideModal()
        }
      } catch (error) {
        this._alertService.showError('Mensaje del sistema.', 'Ocurrió un error al guardar el usuario');
      }
    } else {
      this._alertService.showError('Mensaje del sistema.', 'Por favor, completa todos los campos correctamente');
      this.frmUsers.markAllAsTouched()
    }
  }

}
