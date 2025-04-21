import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function formatDateInText(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are zero-indexed
  const year = date.getFullYear()

  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const formattedTime = `${hours}:${minutes}:${seconds}`

  return `${day}/${month}/${year} : ${formattedTime}`
}

export function minDate(days: number): Date {
  const today = new Date()
  today.setDate(today.getDate() - days)
  return today
}

export function maxDate(days: number): Date {
  const today = new Date()
  today.setDate(today.getDate() + days)
  return today
}

export function dateRangeValidator(
  name_initial: string,
  name_end: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get(name_initial)?.value
    const endDate = control.get(name_end)?.value

    if (!startDate || !endDate) {
      return null // Don't validate if either date is not set
    }

    if (new Date(startDate) > new Date(endDate)) {
      return { dateRangeInvalid: true }
    }

    return null
  }
}
