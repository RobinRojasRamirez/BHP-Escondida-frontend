import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,

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
  step: string = 'login';
  codeForm!: FormGroup;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
  ) { }


  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      email: '',
      password: ''
    });
    this.codeForm = this.fb.group({
      code: ''
    });
  }

  onSubmit() {
    this.errorMessage = '';
    let params = {
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.loginService.login(params).subscribe({
      next: (res) => {
        if ( res.requiere_verificacion ) {
          this.step = 'code';
          this.email = this.form.value.email;
        } else {
          location.reload();
        }
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas';
      }
    });
  }

  verifyCode() {
    this.errorMessage = '';
    const code = this.codeForm.value.code;
    this.loginService.verificarCodigo({ email: this.email, code }).subscribe({
      next: () => {
        location.reload(); 
      },
      error: () => {
        this.errorMessage = 'Código incorrecto o expirado';
      }
    });
  }

}