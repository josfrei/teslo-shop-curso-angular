import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('teslo-shop');



  ngAfterViewInit() {
    let timerInterval: number | undefined;

    Swal.fire({
      title: "¡Despertando al servidor!",
      html: "Puede que el servidor esté dormido <br> Tardará unos <b></b> segundos.",
      timer: 50000,
      timerProgressBar: true,

      showConfirmButton: true,
      confirmButtonText: "Cerrar ahora",
      allowOutsideClick: false,
      allowEscapeKey: false,

      didOpen: () => {
        const timer = Swal.getPopup()!.querySelector("b");

        timerInterval = window.setInterval(() => {
          const milisegundosRestantes = Swal.getTimerLeft();
          const segundosRestantes = Math.ceil(milisegundosRestantes! / 1000);

          timer!.textContent = `${segundosRestantes}`;
        }, 100);
      },

      willClose: () => {
        clearInterval(timerInterval);
      }

    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Cerrado manualmente");
      } else if (result.dismiss === Swal.DismissReason.timer) {
        console.log("Cerrado por el timer");
      }
    });
  }
}
