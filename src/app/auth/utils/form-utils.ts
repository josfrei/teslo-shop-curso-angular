import { AbstractControl } from "@angular/forms";

export class FormUtils {

  //hacemos trim del valor ingresado
  static trimValidator(control: AbstractControl) {
    if (typeof control.value !== 'string') return null;

    const trimmed = control.value.trim();

    // Si cambia, lo actualizamos sin disparar eventos infinitos
    if (control.value !== trimmed) {
      control.setValue(trimmed, { emitEvent: false });
    }

    return null;
  }



}
