import { FormUtils } from '@/utils/form-utils';
import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.html',
})
export class FormErrorLabel {
  //al recibir el abstracConrtol se recibe el objeto con los errores y la info del mismo
  control = input.required<AbstractControl>();

  get mensajeError(){
    const errores: ValidationErrors = this.control().errors || {};
    return this.control().touched && Object.keys(errores).length > 0
    ? FormUtils.getTextError(errores)
    : null;
  }
}
