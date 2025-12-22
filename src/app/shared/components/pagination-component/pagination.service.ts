import { inject, Injectable } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PaginationService {

  private activatedRoute = inject(ActivatedRoute);

  //como se va a estar actualizando dinamicamente la ruta
  paginaActual = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => (params.get('page') ? + params.get('page')! : 1)),
      map(pagina =>(isNaN(pagina) ? 1 : pagina)), // por si se da que ponagn letras en lugar de numeros en laspaginas
    ),{
      initialValue: 1, //inicializamosel toSignal a 1.
    }
  )


}
