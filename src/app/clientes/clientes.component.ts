import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import {ClienteService} from './cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService) { }

  ngOnInit() {
    this.clienteService.getClientes().subscribe(
      clientes => this.clientes = clientes
    );
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
