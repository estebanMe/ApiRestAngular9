import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import {ClienteService} from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService) { }

  ngOnInit() {
    let page = 0;
    this.clienteService.getClientes(page)
    .pipe(
     tap(response => {
           console.log('ClientesComponent: tap 3');
           (response.content as Cliente[]).forEach(cliente => {
             console.log(cliente.nombre);
           });
      })
    ).subscribe(response => this.clientes = response.content as Cliente[]);

    // this.clienteService.getClientes().subscribe(
    //   clientes => this.clientes = clientes
    // );
  }

delete(cliente: Cliente): void {
  Swal.fire({
    title: '¿Está seguro?',
    text: `Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, eliminar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true
  }).then((result) => {
              if (result.value) {

                      this.clienteService.remove(cliente.id).subscribe(
                        (response) => {
                          this.clientes = this.clientes.filter(cli => cli !== cliente);
                          Swal.fire(
                          'Cliente eliminado!',
                          'Cliente ${cliente.nombre}, eliminado con exito',
                          'success'
                        );

                    } );
              }
        }
      );
    }
}
