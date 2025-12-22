import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'pagination-component',
  imports: [
    RouterLink,
],
  templateUrl: './pagination-component.html',
})
export class PaginationComponent {
  paginasTotales = input(0); //numero paginas, predefinido 0 páginas
  paginaActual = input<number>(1); //pagina actual, predf 1

  paginaActiva = linkedSignal(this.paginaActual);

  // obtenemos las páginas
  obtenerListadoPaginas = computed(() => {
    return Array.from({ length: this.paginasTotales() }, (_, i) => i + 1);
  })

}
