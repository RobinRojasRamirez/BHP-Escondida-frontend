import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast'
import { CardModule } from 'primeng/card'
import { MessageService } from 'primeng/api';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule, 
    CheckboxModule, 
    InputTextModule, 
    PasswordModule, 
    FormsModule, 
    RouterModule, 
    RippleModule,
    NgIf,
    ToastModule,
    CardModule
  ],
  providers: [ MessageService ]
})
export class LoginComponent {

  form!: FormGroup
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService
  ) { }


  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      email: '',
      password: ''
    });
  }

  async onSubmit() {
    this.errorMessage = '';
    let params = {
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.loginService.login(params).subscribe({
      next: async () => {
        location.reload();
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas';
      }
    });
  }
  
}