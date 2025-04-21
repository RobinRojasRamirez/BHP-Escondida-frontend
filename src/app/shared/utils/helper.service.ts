import { Injectable } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { AppBreadcrumbService } from '../services/app.breadcrumb.service'
import { IBreadcrumb } from '../interfaces/breadcrumb.interface'
import { Data } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class HelpersService {
  constructor(
    private _breadcrumbService: AppBreadcrumbService
  ) {}
  getFormControlNgClass(
    form: FormGroup,
    controlName: string,
    className: string = '|'
  ): string {
    const control = form.get(controlName) as FormControl
    return this.generateNgClass(
      control.invalid && (control.dirty || control.touched),
      className
    )
  }

  convertPhone(phones: string): string {
    const phone = JSON.parse(phones)
    if (phone.length) {
      const phonePrincipal = phone.find(
        (elem: { type: string }) => elem.type == 'Principal'
      )
      return phonePrincipal ? phonePrincipal.phone : phone[0].phone
    } else {
      return 'No registra'
    }
  }

  generateNgClass(condition: boolean, className: string): string {
    return condition ? className : ''
  }

  setBreadcrumb(iBreadcrumb: IBreadcrumb | Data): void {
    let breadcrumb = [
      ...[iBreadcrumb.breadcrumb],
      ...[iBreadcrumb.breadcrumb_children],
    ]
    breadcrumb = breadcrumb.filter((elem) => elem !== undefined)
    this._breadcrumbService.setItems(breadcrumb)
  }
}
