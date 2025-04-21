import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { lastValueFrom } from 'rxjs';
import { AlertService } from '../../../../../shared/services/alert.service';
import { InstructionsService } from '../../../services/instructions.service';
import { HttpStatusCode } from '@angular/common/http';
import { LoginService } from '../../../../login/services/login.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { IInstructionsSave } from '../../../interfaces/save-instructions.interface';
import { IInstructionGetId } from '../../../interfaces/get-id-instructions.interface';

@Component({
  selector: 'app-form-instructions',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToggleSwitchModule,
    ProgressSpinnerModule,
    CardModule
  ],
  templateUrl: './form-instructions.component.html',
  styleUrl: './form-instructions.component.css'
})
export class FormInstructionsComponent implements OnInit {

  title: string = ''
  instructionsForm!: FormGroup
  slug: string | null = 'create';

  user: { id: number, userData: any } | null = null;
  id: number | null = null
  previewError: boolean = false;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private readonly _alertService: AlertService,
    private readonly _instructionsService: InstructionsService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _loginService: LoginService,
    private sanitizer: DomSanitizer
  ) {
    this.slug = this._activatedRoute.snapshot.data['slug'];
    this.id = this._activatedRoute.snapshot.params['id'];
  }
  async ngOnInit(): Promise<void> {
    this.loadingForm()
    this.user = await this._loginService.getStoredUser();
    this.title = 'Crear Instructivo'
    if ( this.id) {
      this.title = 'Actualizar Instructivo'
      this.loadInstructionId()
    }
  }

  loadingForm() {
    this.instructionsForm = this.fb.group({
      id: [''],
      active: [true],
      name: ['', Validators.required],
      url: ['', Validators.required],
    });
  }

  async loadInstructionId() {
    const response = await lastValueFrom(this._instructionsService.getInstructionId(this.id));
    if ( response && response.data ) {
      const instruction = response.data;
      instruction.active = instruction.active === 1 ? true : false;
      this.instructionsForm.patchValue(instruction);
    }
  }

  backToPage(): void {
    this._router.navigate(['/instructions']);
  }

  transformData(): IInstructionsSave {
    const formValues = this.instructionsForm.value;
    return {
      id: Number(this.id) || null, 
      active: formValues.active === true ? 1 : 2,
      name: formValues.name,
      url: formValues.url,
      user_id: this.user?.userData?.id
    };
  }

  async onSubmit(): Promise<void> {
    if ( this.instructionsForm.valid ) {
      const transformedData = this.transformData()
      try {
        const response = await lastValueFrom(this._instructionsService.createInstruction(transformedData));
        if( response.data && response.status === HttpStatusCode.Created || response.status === HttpStatusCode.Ok ) {
          this._alertService.showSuccess('Mensaje del sistema.', response.message || 'Api creada exitosamente');
          this._router.navigate(['/instructions']);
        }
      } catch (error) {
        this._alertService.showError('Mensaje del sistema.', 'Ocurrió un error al guardar la lista');
      }
    } else {
      this._alertService.showError('Mensaje del sistema.', 'Por favor, completa todos los campos correctamente');
      this.instructionsForm.markAllAsTouched()
    }
  }

  get urlValue(): string {
    return this.instructionsForm.get('url')?.value || '';
  }

  isYoutubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }
  
  sanitizeYoutubeUrl(url: string): SafeResourceUrl {
    const videoId = url.includes('watch?v=')
      ? url.split('watch?v=')[1]
      : url.split('/').pop();
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }
  
  isOfficeFile(url: string): boolean {
    return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(url);
  }

  isExcelFile(url: string): boolean {
    return /\.(xls|xlsx)$/i.test(url);
  }
  
  sanitizeUrl(url: string): SafeResourceUrl {
    this.previewError = false;
    if (this.isOfficeFile(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`
      );
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
